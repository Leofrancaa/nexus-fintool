"use client";

import { useState } from "react";
import { differenceInDays, format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";

import { CardType } from "@/types/card";
import { formatCurrency } from "@/utils/format";
import EditButton from "../ui/editButton";
import DeleteButton from "../ui/deleteButton";
import ConfirmDialog from "../ui/confirmDialog";

interface CardVisualProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: number) => void;
}

export function CardVisual({ card, onEdit, onDelete }: CardVisualProps) {
  const {
    id,
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

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cards/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao excluir o cartão");

      toast.success(data.message || "Cartão excluído com sucesso");
      onDelete(id);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao excluir o cartão";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="rounded-xl shadow-md overflow-hidden border bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--card-text)]">
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
      <div className="p-4">
        <div className="flex justify-between mb-2 text-sm">
          <span>Limite usado</span>
          <span className="font-semibold">{percentualUsado.toFixed(1)}%</span>
        </div>

        <div className="h-2 w-full rounded-full overflow-hidden mb-2 bg-[var(--card-border)]">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${percentualUsado}%`,
              backgroundColor: "#00D4D4",
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mb-4">
          <span className="text-[var(--card-text)]">
            {formatCurrency(gasto_total)}
          </span>
          <span className="text-[var(--card-text)]">
            {formatCurrency(limite)}
          </span>
        </div>

        {/* Próximo vencimento + ações */}
        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              Próximo vencimento
            </p>
            <p className="font-medium text-[var(--card-text)]">
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

            <EditButton
              onClick={() => onEdit(card)}
              title="Editar cartão"
              size="md"
            />

            <DeleteButton onClick={() => setConfirmOpen(true)} />
          </div>
        </div>
      </div>

      {/* Diálogo de confirmação */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deseja excluir o cartão?"
        description="Se ele tiver despesas de meses anteriores, elas também serão removidas."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
