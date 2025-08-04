export interface Income {
    id: number;
    tipo: string;
    quantidade: number;
    data: string;
    fonte: string;
    fixo?: boolean; // ✅ novo campo
    observacoes?: string;
    category_id?: number;
    categoria_nome?: string;
    cor_categoria?: string;
}
