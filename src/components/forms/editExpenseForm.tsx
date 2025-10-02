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
import { apiRequest } from "@/lib/auth";
import {
  getApiErrorMessage,
  getContextualErrorMessage,
  generateToastId,
  validateRequiredFields,
  validatePositiveNumber,
} from "@/utils/errorUtils";

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
    expense.data ? expense.data.split("T")[0] : ""
  );
  const [categoriaId, setCategoriaId] = useState(
    String(expense.category_id || "")
  );
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await apiRequest("/api/categories?tipo=despesa");
        const data = await res.json();
        setCategorias(data.data || []);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        toast.error("Erro ao carregar categorias", {
          id: "load-expense-categories-edit",
        });
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    const requiredFieldsValidation = validateRequiredFields({
      Descrição: tipo,
      Valor: quantidade,
      "Método de pagamento": metodoPagamento,
      Data: data,
      Categoria: categoriaId,
    });

    if (requiredFieldsValidation) {
      toast.error(requiredFieldsValidation, {
        id: "expense-edit-validation",
      });
      return;
    }

    // Validação do valor
    const valueValidation = validatePositiveNumber(quantidade, "O valor");
    if (valueValidation) {
      toast.error(valueValidation, {
        id: "expense-edit-value-validation",
      });
      return;
    }

    const toastId = generateToastId("update", "expense", expense.id);

    try {
      toast.loading("Atualizando despesa...", { id: toastId });

      const res = await apiRequest(`/api/expenses/${expense.id}`, {
        method: "PUT",
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
      });

      if (!res.ok) {
        const errorMessage = await getApiErrorMessage(
          res,
          "Erro ao atualizar despesa. Verifique os dados informados"
        );
        toast.error(errorMessage, { id: toastId });
        return;
      }

      toast.success("Despesa atualizada com sucesso!", { id: toastId });
      onUpdated?.();
      onClose();
    } catch (error) {
      const errorMessage = getContextualErrorMessage(
        error,
        "update",
        "despesa"
      );
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Descrição *</Label>
        <Input
          placeholder="Ex: Almoço, Gasolina..."
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Valor (R$) *</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Ex: 50.00"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Método de Pagamento *</Label>
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
        <Label>Categoria *</Label>
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
        <Label>Data *</Label>
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
