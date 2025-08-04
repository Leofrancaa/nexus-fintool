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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories?tipo=receita`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setCategorias(data);
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao || !valor || !data || !fonte || !categoriaId) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/incomes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            tipo: descricao,
            quantidade: parseFloat(valor),
            data,
            fonte,
            observacoes: nota,
            fixo,
            category_id: parseInt(categoriaId),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        toast.error(errorData?.error || "Erro ao cadastrar receita.");
        return;
      }

      toast.success("Receita cadastrada!");
      onCreated?.();
      onClose();
    } catch {
      toast.error("Erro ao cadastrar receita.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      {/* Descrição e Valor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Descrição</Label>
          <Input
            variant="dark"
            placeholder="Ex: Salário, Venda online..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div>
          <Label>Valor</Label>
          <Input
            variant="dark"
            type="number"
            placeholder="Ex: 5000"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>
      </div>

      {/* Data e Fonte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Data</Label>
          <Input
            variant="dark"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <div>
          <Label>Fonte</Label>
          <Input
            variant="dark"
            placeholder="Ex: Empresa X, Banco Y..."
            value={fonte}
            onChange={(e) => setFonte(e.target.value)}
          />
        </div>
      </div>

      {/* Categoria */}
      <div>
        <Label>Categoria</Label>
        <Select value={categoriaId} onValueChange={setCategoriaId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Receita fixa */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFixo(!fixo)}
          className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors duration-300 ${
            fixo ? "bg-blue-600" : "bg-gray-400"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              fixo ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-white text-sm">Receita fixa</span>
      </div>

      {/* Nota */}
      <div>
        <Label>Nota</Label>
        <Textarea
          variant="dark"
          placeholder="Ex: Recebido via transferência"
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
          className="px-6 py-3 w-full rounded-xl text-white font-semibold text-[16px] bg-[#00D4D4] hover:opacity-80 hover:text-black transition-all"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
