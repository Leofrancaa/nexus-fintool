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
        return localStorage.getItem(TOKEN_KEY);
    },

    set: (token: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TOKEN_KEY, token);
    },

    remove: (): void => {
        if (typeof window === 'undefined') return;
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
            headers.set('Authorization', `Bearer ${token}`);
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
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: createHeaders(false), // Não incluir auth no register
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    return await response.json();
};

export const login = async (data: {
    email: string;
    senha: string;
}): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: createHeaders(false), // Não incluir auth no login
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        await handleApiError(response);
    }

    const result: LoginResponse = await response.json();

    // Salvar token no localStorage
    if (result.success && result.token) {
        tokenManager.set(result.token);
    }

    return result;
};

export const logout = (): void => {
    tokenManager.remove();
    // Redirecionar para login será feito no componente
};

// Verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
    return !!tokenManager.get();
};

// Helper genérico para fazer requisições autenticadas
export const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

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

    // Se receber 401, o token provavelmente expirou
    if (response.status === 401) {
        tokenManager.remove();
        // Redirecionar para login será tratado no middleware
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    return response;
};