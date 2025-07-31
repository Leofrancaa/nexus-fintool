"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

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

interface NewCardFormProps {
  onClose: () => void;
  onCreated?: () => void;
}

export function NewCardForm({ onClose, onCreated }: NewCardFormProps) {
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState<"crédito" | "débito">("crédito");
  const [limite, setLimite] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !nome ||
      !numero ||
      !tipo ||
      !limite ||
      !diaVencimento ||
      !corSelecionada
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nome,
          numero,
          tipo,
          limite: parseFloat(limite),
          dia_vencimento: parseInt(diaVencimento),
          cor: corSelecionada,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Cartão cadastrado com sucesso!");
      onCreated?.();
      onClose();
    } catch {
      toast.error("Erro ao salvar cartão");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div>
        <Label>Nome do Cartão</Label>
        <Input
          placeholder="Ex: Nubank, Visa, etc"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Número */}
      <div>
        <Label>Número (somente os 4 últimos)</Label>
        <Input
          placeholder="1234"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          className="mt-1"
          maxLength={4}
        />
      </div>

      {/* Tipo */}
      <div>
        <Label>Tipo</Label>
        <div className="flex gap-4 mt-2">
          {["crédito", "débito"].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTipo(t as "crédito" | "débito")}
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

      {/* Limite */}
      <div>
        <Label>Limite</Label>
        <Input
          placeholder="Ex: 5000"
          type="number"
          value={limite}
          onChange={(e) => setLimite(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Dia vencimento */}
      <div>
        <Label>Dia de Vencimento</Label>
        <Input
          placeholder="Ex: 15"
          type="number"
          min={1}
          max={31}
          value={diaVencimento}
          onChange={(e) => setDiaVencimento(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Cor */}
      <div>
        <Label>Cor do Cartão</Label>
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
