"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

interface Props {
  planId: number;
  onClose: () => void;
  onContributed?: () => void;
}

export function ContributeForm({ planId, onClose, onContributed }: Props) {
  const [valor, setValor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedValor = parseFloat(valor);

    if (!valor || isNaN(parsedValor) || parsedValor <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plans/${planId}/contribute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ valor: parsedValor }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Erro ao contribuir.");
        return;
      }

      toast.success("Contribuição adicionada!");
      onContributed?.();
      onClose();
    } catch {
      toast.error("Erro ao contribuir.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div>
        <Label>Valor da contribuição (R$)</Label>
        <Input
          variant="dark"
          type="number"
          placeholder="Ex: 200.00"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </div>

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
          Contribuir
        </button>
      </div>
    </form>
  );
}
