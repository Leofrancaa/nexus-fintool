export interface Categoria {
    id: number;
    nome: string;
    cor: string;
    tipo: "despesa" | "receita";
    parent_id: number | null;
}
