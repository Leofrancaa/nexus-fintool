// src/utils/errorUtils.ts

/**
 * Extrai mensagem de erro de diferentes formatos de resposta
 */
type ErrorWithMessage = { message: string };
type ErrorWithError = { error: string };

export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
    // Prioridade: error.message > error.error > error > defaultMessage
    if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as ErrorWithMessage).message === 'string') {
        return (error as ErrorWithMessage).message;
    }
    if (typeof error === 'object' && error !== null && 'error' in error && typeof (error as ErrorWithError).error === 'string') {
        return (error as ErrorWithError).error;
    }
    if (typeof error === 'string') return error;
    return defaultMessage;
};

/**
 * Extrai mensagem de erro de resposta da API
 */
export const getApiErrorMessage = async (response: Response, defaultMessage: string): Promise<string> => {
    try {
        const errorData = await response.json();
        return getErrorMessage(errorData, defaultMessage);
    } catch {
        return defaultMessage;
    }
};

/**
 * Mensagens de erro contextuais
 */
export const ERROR_MESSAGES = {
    // Validation Errors
    REQUIRED_FIELDS: "Por favor, preencha todos os campos obrigatórios",
    INVALID_EMAIL: "Este email não é válido",
    INVALID_VALUE: "O valor precisa ser um número positivo",
    INVALID_DATE: "Esta data não é válida",
    INVALID_CATEGORY: "Por favor, escolha uma categoria",

    // Authentication Errors
    INVALID_CREDENTIALS: "Email ou senha incorretos",
    SESSION_EXPIRED: "Sua conexão expirou. Entre novamente",
    UNAUTHORIZED: "Você não tem permissão para fazer isso",

    // Business Logic Errors
    INSUFFICIENT_LIMIT: "O limite do cartão não é suficiente",
    DUPLICATE_CATEGORY: "Já existe uma categoria com esse nome",
    PLAN_ALREADY_COMPLETED: "Este plano já foi concluído",

    // Network/Server Errors
    NETWORK_ERROR: "Sem conexão com a internet. Verifique e tente novamente",
    SERVER_ERROR: "Algo deu errado. Tente novamente",

    // Default Messages
    SAVE_ERROR: "Não foi possível salvar",
    UPDATE_ERROR: "Não foi possível atualizar",
    DELETE_ERROR: "Não foi possível excluir",
    LOAD_ERROR: "Não foi possível carregar as informações"
};

/**
 * Gera mensagem de erro contextual baseada no tipo de operação e entidade
 */
export const getContextualErrorMessage = (
    error: unknown,
    context: 'save' | 'update' | 'delete' | 'load',
    entity: string
): string => {
    const errorMessage = getErrorMessage(error, '');

    // Mapear erros específicos da API
    if (errorMessage.includes('required') || errorMessage.includes('obrigatório')) {
        return ERROR_MESSAGES.REQUIRED_FIELDS;
    }

    if (errorMessage.includes('invalid') || errorMessage.includes('inválido')) {
        return `Dados inválidos para ${entity}`;
    }

    if (errorMessage.includes('not found') || errorMessage.includes('não encontrado')) {
        return `${entity} não encontrado(a)`;
    }

    if (errorMessage.includes('unauthorized') || errorMessage.includes('não autorizado')) {
        return ERROR_MESSAGES.UNAUTHORIZED;
    }

    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
        return ERROR_MESSAGES.NETWORK_ERROR;
    }

    if (errorMessage.includes('duplicate') || errorMessage.includes('duplicado') || errorMessage.includes('já existe')) {
        return `Já existe um(a) ${entity} com esses dados`;
    }

    // Se temos uma mensagem específica da API, use ela
    if (errorMessage) return errorMessage;

    // Fallback baseado no contexto
    const contextMessages = {
        save: `Não foi possível salvar ${entity}`,
        update: `Não foi possível atualizar ${entity}`,
        delete: `Não foi possível excluir ${entity}`,
        load: `Não foi possível carregar ${entity}`
    };

    return contextMessages[context];
};

/**
 * Gera ID único para toasts baseado na operação
 */
export const generateToastId = (action: string, entity: string, id?: string | number): string => {
    const timestamp = Date.now();
    const identifier = id ? `${id}` : timestamp;
    return `${action}-${entity}-${identifier}`;
};

/**
 * Valida campos obrigatórios e retorna mensagem específica
 */
export const validateRequiredFields = (fields: Record<string, unknown>): string | null => {
    const emptyFields = Object.entries(fields)
        .filter(([, value]) => !value || (typeof value === 'string' && value.trim() === ''))
        .map(([key]) => key);

    if (emptyFields.length === 0) return null;

    if (emptyFields.length === 1) {
        return `Por favor, preencha o campo ${emptyFields[0]}`;
    }

    if (emptyFields.length === 2) {
        return `Por favor, preencha os campos ${emptyFields.join(' e ')}`;
    }

    const lastField = emptyFields.pop();
    return `Por favor, preencha os campos ${emptyFields.join(', ')} e ${lastField}`;
};

/**
 * Valida valor numérico positivo
 */
export const validatePositiveNumber = (value: string | number, fieldName: string): string | null => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return `${fieldName} precisa ser um número válido`;
    }

    if (numValue <= 0) {
        return `${fieldName} precisa ser um valor positivo`;
    }

    return null;
};