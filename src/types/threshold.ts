export interface Threshold {
    id: number;
    category_id: number;
    valor: number;
    categoria: {
        id: number;
        nome: string;
        cor: string;
        tipo: "despesa" | "receita";
    };
}
