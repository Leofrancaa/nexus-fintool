"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Expense } from "@/types/expense";

interface Categoria {
  id: number;
  nome: string;
}

interface Props {
  expense: Expense;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditExpenseForm({ expense, onClose, onUpdated }: Props) {
  const [tipo, setTipo] = useState(expense.tipo || "");
  const [quantidade, setQuantidade] = useState(
    String(expense.quantidade || "")
  );
  const [metodoPagamento, setMetodoPagamento] = useState(
    expense.metodo_pagamento || ""
  );
  const [data, setData] = useState(
    expense.data ? new Date(expense.data).toISOString().split("T")[0] : ""
  );
  const [categoriaId, setCategoriaId] = useState(
    String(expense.category_id || "")
  );
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading("Atualizando despesa...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${expense.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipo,
            quantidade: parseFloat(quantidade),
            metodo_pagamento: metodoPagamento,
            data,
            category_id: parseInt(categoriaId),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao atualizar despesa.");
      }

      toast.success("Despesa atualizada com sucesso!", { id: toastId });
      onUpdated?.();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar despesa.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Descrição</Label>
        <Input
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Quantidade (R$)</Label>
        <Input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Método de Pagamento</Label>
        <Select value={metodoPagamento} onValueChange={setMetodoPagamento}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dinheiro">Dinheiro</SelectItem>
            <SelectItem value="cartao de credito">Cartão de Crédito</SelectItem>
            <SelectItem value="debito">Débito</SelectItem>
            <SelectItem value="pix">Pix</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Categoria</Label>
        <Select value={categoriaId} onValueChange={setCategoriaId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((categoria) => (
              <SelectItem key={categoria.id} value={String(categoria.id)}>
                {categoria.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Data</Label>
        <Input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-[#1F2937] text-white hover:bg-[#374151] transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition"
        >
          Salvar Alterações
        </button>
      </div>
    </form>
  );
}
