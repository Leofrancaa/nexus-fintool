"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Categoria } from "@/types/category";
import { Threshold } from "@/types/threshold";

interface Props {
  onClose: () => void;
  onCreated?: (limite: Threshold) => void;
  onUpdated?: () => void;
  threshold?: Threshold;
  mode?: "create" | "edit";
}

export function NewThresholdForm({
  onClose,
  onCreated,
  onUpdated,
  threshold,
  mode = "create",
}: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [valor, setValor] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error();
        const data: Categoria[] = await res.json();
        const pais = data.filter(
          (cat) => !cat.parent_id && cat.tipo === "despesa"
        );
        setCategorias(pais);
      } catch {
        toast.error("Erro ao carregar categorias");
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (mode === "edit" && threshold) {
      setCategoriaId(threshold.category_id);
      setValor(threshold.valor.toString());
    }
  }, [mode, threshold]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoriaId || !valor) {
      toast.error("Selecione uma categoria e valor");
      return;
    }

    try {
      let res;

      if (mode === "edit" && threshold) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/thresholds/${threshold.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              category_id: categoriaId,
              valor: parseFloat(valor),
            }),
          }
        );

        if (!res.ok) throw new Error();
        toast.success("Limite atualizado!");
        onUpdated?.();
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/thresholds`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            category_id: categoriaId,
            valor: parseFloat(valor),
          }),
        });

        if (!res.ok) throw new Error();
        const novo: Threshold = await res.json();
        toast.success("Limite criado!");
        onCreated?.(novo);
      }

      onClose();
    } catch {
      toast.error("Erro ao salvar limite");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Categoria */}
      <div>
        <Label>Categoria</Label>
        <select
          value={categoriaId ?? ""}
          onChange={(e) => setCategoriaId(Number(e.target.value))}
          className="w-full mt-1 px-4 py-2 rounded-md bg-[#1B1B1B] text-white border border-[#2e2e2e]"
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Valor */}
      <div>
        <Label>Valor do Limite (R$)</Label>
        <Input
          type="number"
          placeholder="Ex: 1000"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="mt-1"
          min={0}
        />
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
          {mode === "edit" ? "Atualizar" : "Salvar"}
        </button>
      </div>
    </form>
  );
}
