"use client";

import { CardType } from "@/types/card";
import { formatCurrency } from "@/utils/format";
import { differenceInDays, format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import EditButton from "../ui/editButton";

interface CardVisualProps {
  card: CardType;
  onEdit: (card: CardType) => void;
}

export function CardVisual({ card, onEdit }: CardVisualProps) {
  const {
    nome,
    numero,
    tipo,
    limite,
    limite_disponivel,
    dia_vencimento,
    cor,
    proximo_vencimento,
  } = card;

  const gasto_total = limite - limite_disponivel;
  const percentualUsado = Math.min((gasto_total / limite) * 100, 100);
  const diasRestantes = differenceInDays(
    new Date(proximo_vencimento),
    new Date()
  );
  const vencimentoExpirado = diasRestantes < 0;

  return (
    <div className="rounded-xl shadow-md overflow-hidden bg-[#1b1b1b] border border-[#2e2e2e]">
      {/* Topo com cor do cartão */}
      <div
        className="p-4 text-white flex justify-between items-start"
        style={{ backgroundColor: cor }}
      >
        <div>
          <p className="text-sm font-medium">{nome}</p>
          <p className="text-lg font-semibold tracking-wider">
            **** **** **** {numero}
          </p>
          <p className="text-sm mt-1">
            Vence dia <strong>{dia_vencimento}</strong>
          </p>
        </div>

        <span className="text-xs bg-white/20 px-2 py-1 rounded-md">{tipo}</span>
      </div>

      {/* Corpo: limite usado */}
      <div className="p-4 text-white">
        <div className="flex justify-between mb-2 text-sm">
          <span>Limite usado</span>
          <span className="font-semibold">{percentualUsado.toFixed(1)}%</span>
        </div>

        <div className="h-2 w-full bg-[#2e2e2e] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-[#00D4D4] transition-all duration-300"
            style={{ width: `${percentualUsado}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-300 mb-4">
          <span>{formatCurrency(gasto_total)}</span>
          <span>{formatCurrency(limite)}</span>
        </div>

        {/* Próximo vencimento */}
        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-gray-400">Próximo vencimento</p>
            <p className="text-white font-medium">
              {format(new Date(proximo_vencimento), "dd/MM/yyyy")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {vencimentoExpirado && (
              <div className="flex items-center gap-1 text-red-500 font-semibold">
                <AlertTriangle size={16} />
                <span>{diasRestantes}d</span>
              </div>
            )}
            <div className="flex justify-end">
              <EditButton
                onClick={() => onEdit(card)}
                title="Editar cartão"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
