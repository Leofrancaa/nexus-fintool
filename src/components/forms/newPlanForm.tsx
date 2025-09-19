"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textArea";
import { toast } from "react-hot-toast";
import { apiRequest } from "@/lib/auth";
import {
  getApiErrorMessage,
  getContextualErrorMessage,
  generateToastId,
} from "@/utils/errorUtils";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

export function NewPlanForm({ onClose, onCreated }: Props) {
  const [nome, setNome] = useState("");
  const [meta, setMeta] = useState("");
  const [prazo, setPrazo] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Criar ID único para evitar toasts duplicados
    const toastId = generateToastId("save", "plan");

    // Validação dos campos obrigatórios
    if (!nome || !meta || !prazo) {
      toast.error("Os campos Nome, Meta e Prazo são obrigatórios", {
        id: toastId,
      });
      return;
    }

    // Validação do valor da meta
    if (isNaN(parseFloat(meta)) || parseFloat(meta) <= 0) {
      toast.error("A meta deve ser um valor positivo", {
        id: toastId,
      });
      return;
    }

    try {
      toast.loading("Salvando plano...", { id: toastId });

      const res = await apiRequest("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          meta: parseFloat(meta),
          prazo,
          descricao,
        }),
      });

      if (!res.ok) {
        const errorMessage = await getApiErrorMessage(
          res,
          "Erro ao salvar plano. Verifique os dados informados"
        );
        toast.error(errorMessage, { id: toastId });
        return;
      }

      toast.success("Plano cadastrado com sucesso!", { id: toastId });
      onCreated?.();
      onClose();
    } catch (error) {
      const errorMessage = getContextualErrorMessage(error, "save", "plano");
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome do Plano *</Label>
        <Input
          placeholder="Ex: Viagem para Europa, Comprar carro..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div>
        <Label>Meta (R$) *</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Ex: 10000.00"
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
        />
      </div>

      <div>
        <Label>Prazo *</Label>
        <Input
          type="date"
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
        />
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea
          placeholder="Descreva mais detalhes sobre este plano..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
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
          Salvar Plano
        </button>
      </div>
    </form>
  );
}
