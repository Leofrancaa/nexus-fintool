"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Categoria } from "@/types/category";

const cores = [
  "#6366f1",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#60a5fa",
  "#ec4899",
  "#06b6d4",
];

interface NewCategoryFormProps {
  onClose: () => void;
  onCreated?: (categoria: Categoria) => void;
}

export function NewCategoryForm({ onClose, onCreated }: NewCategoryFormProps) {
  const [nome, setNome] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("");
  const [tipo, setTipo] = useState<"despesa" | "receita">("despesa");
  const [parentId, setParentId] = useState<number | null>(null);
  const [categoriasPai, setCategoriasPai] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          {
            credentials: "include", // ✅ usa cookie para autenticação
          }
        );

        if (!res.ok) throw new Error();
        const data: Categoria[] = await res.json();
        setCategoriasPai(data.filter((cat) => !cat.parent_id));
      } catch {
        toast.error("Erro ao carregar categorias existentes");
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !corSelecionada || !tipo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ usa cookie HTTP-only
          body: JSON.stringify({
            nome,
            cor: corSelecionada,
            tipo,
            parent_id: parentId,
          }),
        }
      );

      if (!res.ok) throw new Error();

      const novaCategoria: Categoria = await res.json();
      toast.success("Categoria criada com sucesso!");
      onCreated?.(novaCategoria);
      onClose();
    } catch {
      toast.error("Erro ao salvar categoria");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div>
        <Label>Nome da Categoria</Label>
        <Input
          placeholder="Ex: Alimentação, Transporte..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Cor */}
      <div>
        <Label>Cor da Categoria</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {cores.map((cor) => (
            <button
              key={cor}
              type="button"
              className={`h-8 rounded-md border-2 transition-all cursor-pointer ${
                corSelecionada === cor
                  ? "border-white ring-2 ring-offset-2 ring-[#00D4D4]"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: cor }}
              onClick={() => setCorSelecionada(cor)}
            />
          ))}
        </div>
      </div>

      {/* Tipo */}
      <div>
        <Label>Tipo</Label>
        <div className="flex gap-4 mt-2">
          {["despesa", "receita"].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTipo(t as "despesa" | "receita")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
                tipo === t
                  ? "bg-[#2256FF] text-white"
                  : "bg-[#1B1B1B] text-white border border-[#2e2e2e]"
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Categoria Pai */}
      <div>
        <Label>Categoria Pai (opcional)</Label>
        <select
          value={parentId ?? ""}
          onChange={(e) =>
            setParentId(e.target.value === "" ? null : Number(e.target.value))
          }
          className="w-full mt-1 px-4 py-2 rounded-md bg-[#1B1B1B] text-white border border-[#2e2e2e]"
        >
          <option value="">Sem categoria pai</option>
          {categoriasPai.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 w-full rounded-xl font-medium text-white bg-[#1F2937] hover:bg-[#374151] transition-all cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-6 py-3 w-full rounded-xl text-white font-semibold text-[16px] bg-[#00D4D4] cursor-pointer hover:opacity-80 hover:text-black transition-all"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
