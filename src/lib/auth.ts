// src/lib/auth.ts
const API_URL = "http://localhost:3001";

// Tipos
interface LoginResponse {
    success: boolean;
    message: string;
    user: {
        id: number;
        nome: string;
        email: string;
    };
    token: string;
}

interface RegisterResponse {
    success: boolean;
    message: string;
    user?: {
        id: number;
        nome: string;
        email: string;
    };
    token?: string;
}

interface ApiError {
    error: string;
    message?: string;
}

// Gerenciamento de token no localStorage
const TOKEN_KEY = 'nexus_token';

export const tokenManager = {
    get: (): string | null => {
        if (typeof window === 'undefined') return null;
        const token = localStorage.getItem(TOKEN_KEY);
        console.log('tokenManager.get() - Token recuperado:', token ? `TOKEN EXISTE (${token.length} chars)` : 'TOKEN NÃO EXISTE');
        return token;
    },

    set: (token: string): void => {
        if (typeof window === 'undefined') return;
        console.log('tokenManager.set() - Salvando token:', token ? `TOKEN VÁLIDO (${token.length} chars)` : 'TOKEN VAZIO');
        localStorage.setItem(TOKEN_KEY, token);

        // Verificar imediatamente se foi salvo
        const saved = localStorage.getItem(TOKEN_KEY);
        console.log('tokenManager.set() - Verificação pós-save:', saved === token ? 'SUCESSO' : 'FALHA');
    },

    remove: (): void => {
        if (typeof window === 'undefined') return;
        console.log('tokenManager.remove() - Removendo token');
        localStorage.removeItem(TOKEN_KEY);
    }
};

// Helper para criar headers com Authorization
const createHeaders = (includeAuth = true): Headers => {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    if (includeAuth) {
        const token = tokenManager.get();
        if (token) {
            console.log('createHeaders() - Adicionando Authorization header com Bearer token');
            headers.set('Authorization', `Bearer ${token}`);
        } else {
            console.log('createHeaders() - NENHUM TOKEN DISPONÍVEL para Authorization header');
        }
    }

    return headers;
};

// Helper para tratar erros da API
const handleApiError = async (response: Response): Promise<never> => {
    try {
        const error: ApiError = await response.json();
        throw new Error(error.error || error.message || 'Erro desconhecido');
    } catch {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
};

// Funções de autenticação
export const register = async (data: {
    nome: string;
    email: string;
    senha: string;
}): Promise<RegisterResponse> => {
    console.log('register() - Iniciando registro para:', data.email);

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: createHeaders(false), // Não incluir auth no register
        body: JSON.stringify(data),
    });

    console.log('register() - Status da resposta:', response.status);

    if (!response.ok) {
        console.log('register() - Erro na resposta:', response.status, response.statusText);
        await handleApiError(response);
    }

    // Debug: Vamos ver o que está chegando do servidor
    const responseText = await response.text();
    console.log('register() - Resposta raw do servidor:', responseText);

    let result: RegisterResponse;
    try {
        result = JSON.parse(responseText);
    } catch (e) {
        console.error('register() - Erro ao fazer parse do JSON:', e);
        throw new Error('Resposta inválida do servidor');
    }

    console.log('register() - Resposta parseada:', {
        success: result.success,
        hasUser: !!result.user,
        hasToken: !!result.token,
        tokenLength: result.token ? result.token.length : undefined,
        allKeys: Object.keys(result)
    });

    // Salvar token se fornecido no registro
    if (result.success && result.token) {
        console.log('register() - Salvando token no localStorage');
        tokenManager.set(result.token);
    } else {
        console.log('register() - Registro bem-sucedido mas sem token');
    }

    return result;
};

export const login = async (data: {
    email: string;
    senha: string;
}): Promise<LoginResponse> => {
    console.log('login() - Iniciando login para:', data.email);

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: createHeaders(false), // Não incluir auth no login
        body: JSON.stringify(data),
    });

    console.log('login() - Status da resposta:', response.status);

    if (!response.ok) {
        console.log('login() - Erro na resposta:', response.status, response.statusText);
        await handleApiError(response);
    }

    // Debug: Vamos ver o que está chegando do servidor
    const responseText = await response.text();
    console.log('login() - Resposta raw do servidor:', responseText);

    let result: LoginResponse;
    try {
        result = JSON.parse(responseText);
    } catch (e) {
        console.error('login() - Erro ao fazer parse do JSON:', e);
        throw new Error('Resposta inválida do servidor');
    }

    console.log('login() - Resposta parseada completa:', result);
    console.log('login() - Análise da resposta:', {
        success: result.success,
        hasUser: !!result.user,
        hasToken: !!result.token,
        tokenLength: result.token ? result.token.length : undefined,
        tokenPreview: result.token ? result.token.substring(0, 20) + '...' : 'N/A',
        allKeys: Object.keys(result),
        messageExists: !!result.message
    });

    // Salvar token no localStorage
    if (result.success && result.token) {
        console.log('login() - Token encontrado, salvando no localStorage');
        tokenManager.set(result.token);

        // Verificar se foi salvo
        const savedToken = tokenManager.get();
        console.log('login() - Token salvo com sucesso:', !!savedToken);

        if (savedToken !== result.token) {
            console.error('login() - ERRO: Token salvo não confere com o recebido!');
        }
    } else if (result.success && !result.token) {
        console.error('login() - ERRO CRÍTICO: Login bem-sucedido mas sem token!');
        console.error('login() - Resposta completa:', JSON.stringify(result, null, 2));
    }

    return result;
};

export const logout = (): void => {
    console.log('logout() - Removendo token e fazendo logout');
    tokenManager.remove();
    // Redirecionar para login será feito no componente
};

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
    const token = tokenManager.get();
    const authenticated = !!token; // Correção: removida a negação dupla
    console.log('isAuthenticated() - Verificando autenticação:', {
        hasToken: !!token,
        authenticated,
        tokenLength: token ? token.length : 0
    });
    return authenticated;
};

// Helper genérico para fazer requisições autenticadas
export const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    console.log('apiRequest() - Fazendo requisição para:', endpoint);

    const headers = createHeaders(true);

    // Merge headers personalizados se fornecidos
    if (options.headers) {
        const customHeaders = new Headers(options.headers);
        customHeaders.forEach((value, key) => {
            headers.set(key, value);
        });
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    console.log('apiRequest() - Resposta:', response.status, response.statusText);

    // Se receber 401, o token provavelmente expirou
    if (response.status === 401) {
        console.log('apiRequest() - Token expirado (401), removendo e redirecionando');
        tokenManager.remove();
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    return response;
};