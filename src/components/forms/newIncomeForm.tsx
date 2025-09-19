"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Categoria } from "@/types/category";
import { apiRequest } from "@/lib/auth";
import {
  getApiErrorMessage,
  getContextualErrorMessage,
  generateToastId,
  validateRequiredFields,
  validatePositiveNumber,
} from "@/utils/errorUtils";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

export function NewIncomeForm({ onClose, onCreated }: Props) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [nota, setNota] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [fonte, setFonte] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [fixo, setFixo] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await apiRequest("/api/categories?tipo=receita");
        const data = await res.json();
        setCategorias(data.data || []);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        toast.error("Erro ao carregar categorias de receita", {
          id: "load-income-categories",
        });
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos obrigatórios
    const requiredFieldsValidation = validateRequiredFields({
      Descrição: descricao,
      Valor: valor,
      Data: data,
      Fonte: fonte,
      Categoria: categoriaId,
    });

    if (requiredFieldsValidation) {
      toast.error(requiredFieldsValidation, {
        id: "income-validation",
      });
      return;
    }

    // Validação do valor
    const valueValidation = validatePositiveNumber(valor, "O valor");
    if (valueValidation) {
      toast.error(valueValidation, {
        id: "income-value-validation",
      });
      return;
    }

    const toastId = generateToastId("save", "income");

    try {
      toast.loading("Salvando receita...", { id: toastId });

      const res = await apiRequest("/api/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: descricao,
          quantidade: parseFloat(valor),
          data,
          fonte,
          observacoes: nota,
          fixo,
          category_id: parseInt(categoriaId),
        }),
      });

      if (!res.ok) {
        const errorMessage = await getApiErrorMessage(
          res,
          "Erro ao cadastrar receita. Verifique os dados informados"
        );
        toast.error(errorMessage, { id: toastId });
        return;
      }

      toast.success("Receita cadastrada com sucesso!", { id: toastId });
      onCreated?.();
      onClose();
    } catch (error) {
      const errorMessage = getContextualErrorMessage(error, "save", "receita");
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      {/* Descrição e Valor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Descrição *</Label>
          <Input
            placeholder="Ex: Salário, Freelance..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div>
          <Label>Valor (R$) *</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Ex: 2500.00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
      </div>

      {/* Fonte e Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Fonte *</Label>
          <Input
            placeholder="Ex: Empresa XYZ, Cliente ABC..."
            value={fonte}
            onChange={(e) => setFonte(e.target.value)}
          />
        </div>

        <div>
          <Label>Categoria *</Label>
          <Select value={categoriaId} onValueChange={setCategoriaId}>
            <SelectTrigger>
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
      </div>

      {/* Data */}
      <div>
        <Label>Data *</Label>
        <Input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>

      {/* Toggle Receita Fixa */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFixo(!fixo)}
          className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
            fixo ? "bg-green-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              fixo ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-white text-sm">Receita fixa (mensal)</span>
      </div>

      {/* Observações */}
      <div>
        <Label>Observações</Label>
        <Textarea
          placeholder="Informações adicionais sobre esta receita..."
          value={nota}
          onChange={(e) => setNota(e.target.value)}
        />
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 w-full rounded-xl font-medium text-white bg-[#1F2937] hover:bg-[#374151] transition-all"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-6 py-3 w-full rounded-xl text-white font-semibold text-[16px] bg-green-600 hover:opacity-80 hover:text-black transition-all"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
