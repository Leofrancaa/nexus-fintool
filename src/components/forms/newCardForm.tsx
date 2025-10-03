"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { apiRequest } from "@/lib/auth";

const cores = [
  // Azuis
  "#3b82f6", // Azul
  "#60a5fa", // Azul Claro
  "#1e40af", // Azul Escuro
  "#0ea5e9", // Sky Blue
  "#06b6d4", // Ciano

  // Roxos e Rosas
  "#6366f1", // Índigo
  "#8b5cf6", // Roxo
  "#a855f7", // Roxo Claro
  "#ec4899", // Rosa
  "#f43f5e", // Rosa Vermelho

  // Verdes
  "#10b981", // Verde
  "#22c55e", // Verde Claro
  "#14b8a6", // Teal
  "#84cc16", // Lima
  "#16a34a", // Verde Escuro

  // Amarelos e Laranjas
  "#f59e0b", // Âmbar
  "#eab308", // Amarelo
  "#fbbf24", // Amarelo Claro
  "#f97316", // Laranja
  "#fb923c", // Laranja Claro

  // Vermelhos
  "#ef4444", // Vermelho
  "#dc2626", // Vermelho Escuro
  "#f87171", // Vermelho Claro

  // Neutros
  "#64748b", // Slate
  "#78716c", // Stone
  "#71717a", // Zinc
  "#6b7280", // Gray
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
  const [diasFechamentoAntes, setDiasFechamentoAntes] = useState("10"); // default 10
  const [corSelecionada, setCorSelecionada] = useState("");

  const onlyDigits = (v: string) => v.replace(/\D/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !numero || !tipo || !corSelecionada) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (numero.length !== 4) {
      toast.error("O número do cartão deve conter exatamente 4 dígitos");
      return;
    }

    // validações específicas de crédito
    if (tipo === "crédito") {
      if (!limite || parseFloat(limite) <= 0) {
        toast.error("Informe um limite válido");
        return;
      }
      const dia = parseInt(diaVencimento);
      if (!dia || dia < 1 || dia > 31) {
        toast.error("Dia de vencimento deve estar entre 1 e 31");
        return;
      }
      const fechar = parseInt(diasFechamentoAntes);
      if (!fechar || fechar < 1 || fechar > 31) {
        toast.error("Dias de fechamento deve estar entre 1 e 31");
        return;
      }
    }

    try {
      interface CardPayload {
        nome: string;
        numero: string;
        tipo: "crédito" | "débito";
        cor: string;
        limite?: number;
        dia_vencimento?: number;
        dias_fechamento_antes?: number;
      }

      const body: CardPayload = {
        nome,
        numero,
        tipo, // "crédito" | "débito"
        cor: corSelecionada,
      };

      if (tipo === "crédito") {
        body.limite = parseFloat(limite);
        body.dia_vencimento = parseInt(diaVencimento);
        body.dias_fechamento_antes = parseInt(diasFechamentoAntes);
      } else {
        // débito não precisa desses campos; se quiser enviar explicitamente:
        // body.limite = 0;
      }

      const res = await apiRequest("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        toast.error("Não foi possível cadastrar o cartão. Tente novamente");
        return;
      }
      toast.success("Cartão cadastrado com sucesso!");
      onCreated?.();
      onClose();
    } catch (error) {
      toast.error("Não foi possível conectar ao servidor. Verifique sua internet");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[99dvh] overflow-y-auto"
    >
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
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-0">
        {/* Número */}
        <div>
          <Label>Número (somente os 4 últimos)</Label>
          <Input
            placeholder="1234"
            value={numero}
            onChange={(e) => setNumero(onlyDigits(e.target.value).slice(0, 4))}
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
      </div>

      {/* Campos só para crédito */}
      {tipo === "crédito" && (
        <>
          {/* Limite */}
          <div>
            <Label>Limite</Label>
            <Input
              placeholder="Ex: 5000"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
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
              onChange={(e) =>
                setDiaVencimento(onlyDigits(e.target.value).slice(0, 2))
              }
              className="mt-1"
            />
            <p className="text-xs text-white/60 mt-1">
              Dia do mês em que a fatura vence.
            </p>
          </div>

          {/* Dias de fechamento antes do vencimento */}
          <div>
            <Label>Fechamento (dias antes do vencimento)</Label>
            <Input
              placeholder="Ex: 10"
              type="number"
              min={1}
              max={31}
              value={diasFechamentoAntes}
              onChange={(e) =>
                setDiasFechamentoAntes(onlyDigits(e.target.value).slice(0, 2))
              }
              className="mt-1"
            />
            <p className="text-xs text-white/60 mt-1">
              Ex.: se vencer no dia 15 e o fechamento for 10, fecha no dia 5.
            </p>
          </div>
        </>
      )}

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
              aria-label={`Selecionar cor ${cor}`}
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
