// src/lib/auth.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

// Função para logging condicional (só em development)
const debugLog = (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[AUTH] ${message}`, data || '');
    }
};

export const tokenManager = {
    get: (): string | null => {
        if (typeof window === 'undefined') return null;
        const token = localStorage.getItem(TOKEN_KEY);
        debugLog('tokenManager.get() - Token recuperado:', token ? `TOKEN EXISTE (${token.length} chars)` : 'TOKEN NÃO EXISTE');
        return token;
    },

    set: (token: string): void => {
        if (typeof window === 'undefined') return;
        debugLog('tokenManager.set() - Salvando token:', token ? `TOKEN VÁLIDO (${token.length} chars)` : 'TOKEN VAZIO');
        localStorage.setItem(TOKEN_KEY, token);

        // Verificar imediatamente se foi salvo (só em dev)
        if (process.env.NODE_ENV === 'development') {
            const saved = localStorage.getItem(TOKEN_KEY);
            debugLog('tokenManager.set() - Verificação pós-save:', saved === token ? 'SUCESSO' : 'FALHA');
        }
    },

    remove: (): void => {
        if (typeof window === 'undefined') return;
        debugLog('tokenManager.remove() - Removendo token');
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
            debugLog('createHeaders() - Adicionando Authorization header com Bearer token');
            headers.set('Authorization', `Bearer ${token}`);
        } else {
            debugLog('createHeaders() - NENHUM TOKEN DISPONÍVEL para Authorization header');
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
    debugLog('register() - Iniciando registro para:', data.email);

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: createHeaders(false), // Não incluir auth no register
        body: JSON.stringify(data),
    });

    debugLog('register() - Status da resposta:', response.status);

    if (!response.ok) {
        debugLog('register() - Erro na resposta:', `${response.status} ${response.statusText}`);
        await handleApiError(response);
    }

    // Debug: Vamos ver o que está chegando do servidor
    const responseText = await response.text();
    debugLog('register() - Resposta raw do servidor:', responseText);

    let result: RegisterResponse;
    try {
        result = JSON.parse(responseText);
    } catch (e) {
        console.error('register() - Erro ao fazer parse do JSON:', e);
        throw new Error('Resposta inválida do servidor');
    }

    debugLog('register() - Resposta parseada:', {
        success: result.success,
        hasUser: !!result.user,
        hasToken: !!result.token,
        tokenLength: result.token ? result.token.length : undefined,
        allKeys: Object.keys(result)
    });

    // Salvar token se fornecido no registro
    if (result.success && result.token) {
        debugLog('register() - Salvando token no localStorage');
        tokenManager.set(result.token);
    } else {
        debugLog('register() - Registro bem-sucedido mas sem token');
    }

    return result;
};

export const login = async (data: {
    email: string;
    senha: string;
}): Promise<LoginResponse> => {
    debugLog('login() - Iniciando login para:', data.email);

    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: createHeaders(false), // Não incluir auth no login
        body: JSON.stringify(data),
    });

    debugLog('login() - Status da resposta:', response.status);

    if (!response.ok) {
        debugLog('login() - Erro na resposta:', `${response.status} ${response.statusText}`);
        await handleApiError(response);
    }

    // Debug: Vamos ver o que está chegando do servidor
    const responseText = await response.text();
    debugLog('login() - Resposta raw do servidor:', responseText);

    let result: LoginResponse;
    try {
        result = JSON.parse(responseText);
    } catch (e) {
        console.error('login() - Erro ao fazer parse do JSON:', e);
        throw new Error('Resposta inválida do servidor');
    }

    debugLog('login() - Resposta parseada completa:', result);
    debugLog('login() - Análise da resposta:', {
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
        debugLog('login() - Token encontrado, salvando no localStorage');
        tokenManager.set(result.token);

        // Verificar se foi salvo (só em desenvolvimento)
        if (process.env.NODE_ENV === 'development') {
            const savedToken = tokenManager.get();
            debugLog('login() - Token salvo com sucesso:', !!savedToken);

            if (savedToken !== result.token) {
                console.error('login() - ERRO: Token salvo não confere com o recebido!');
            }
        }
    } else if (result.success && !result.token) {
        console.error('login() - ERRO CRÍTICO: Login bem-sucedido mas sem token!');
        if (process.env.NODE_ENV === 'development') {
            console.error('login() - Resposta completa:', JSON.stringify(result, null, 2));
        }
    }

    return result;
};

export const logout = (): void => {
    debugLog('logout() - Removendo token e fazendo logout');
    tokenManager.remove();
    // Redirecionar para login será feito no componente
};

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
    const token = tokenManager.get();
    const authenticated = !!token;
    debugLog('isAuthenticated() - Verificando autenticação:', {
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
    debugLog('apiRequest() - Fazendo requisição para:', endpoint);

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

    debugLog('apiRequest() - Resposta:', `${response.status} ${response.statusText}`);

    // Se receber 401, o token provavelmente expirou
    if (response.status === 401) {
        debugLog('apiRequest() - Token expirado (401), removendo e redirecionando');
        tokenManager.remove();
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    return response;
};