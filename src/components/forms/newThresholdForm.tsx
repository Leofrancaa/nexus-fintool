"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Categoria } from "@/types/category";
import { Threshold } from "@/types/threshold";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/auth";

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
        const res = await apiRequest("/api/categories");

        if (!res.ok) throw new Error();
        const responseData = await res.json();
        const data: Categoria[] = responseData.data || [];
        const pais = data.filter(
          (cat) => !cat.parent_id && cat.tipo === "despesa"
        );
        setCategorias(pais);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
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
        res = await apiRequest(`/api/thresholds/${threshold.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category_id: categoriaId,
            valor: parseFloat(valor),
          }),
        });

        if (!res.ok) throw new Error();
        toast.success("Limite atualizado!");
        onUpdated?.();
      } else {
        res = await apiRequest("/api/thresholds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar limite"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Categoria */}
      <div>
        <Label>Categoria</Label>
        <Select
          value={categoriaId !== null ? categoriaId.toString() : "none"}
          onValueChange={(value) =>
            setCategoriaId(value === "none" ? null : Number(value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="none">Selecione uma categoria</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
