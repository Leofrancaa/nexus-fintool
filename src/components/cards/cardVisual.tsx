"use client";

import { useState } from "react";
import { differenceInDays, format } from "date-fns";
import { AlertTriangle, Wallet } from "lucide-react";
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
  onRefresh?: () => void; // ← para incrementar o refreshKey no pai
}

export function CardVisual({
  card,
  onEdit,
  onDelete,
  onRefresh,
}: CardVisualProps) {
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
    dias_fechamento_antes,
  } = card as CardType & { dias_fechamento_antes?: number };

  const isCredito = (tipo || "").toLowerCase().includes("crédit");
  const diasFechamento =
    typeof dias_fechamento_antes === "number" && dias_fechamento_antes > 0
      ? dias_fechamento_antes
      : 10;

  // datas
  const dueDate = new Date(proximo_vencimento);
  const closeDate = new Date(dueDate);
  closeDate.setDate(closeDate.getDate() - diasFechamento);

  const hoje = new Date();
  const diasAteFechamento = differenceInDays(closeDate, hoje);
  const diasAteVencimento = differenceInDays(dueDate, hoje);

  const fechamentoPassou = diasAteFechamento < 0;
  const vencimentoPassou = diasAteVencimento < 0;

  // limites (somente crédito)
  const gasto_total = isCredito
    ? Math.max(0, Number(limite) - Number(limite_disponivel))
    : 0;
  const percentualUsado =
    isCredito && Number(limite) > 0
      ? Math.min((gasto_total / Number(limite)) * 100, 100)
      : 0;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pagarLoading, setPagarLoading] = useState(false);

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

  const handlePayInvoice = async () => {
    try {
      setPagarLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cards/${id}/pay-invoice`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), // envie { mes, ano } se quiser pagar uma competência específica
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha ao pagar fatura.");

      toast.success(
        `Fatura ${String(data.competencia_mes).padStart(2, "0")}/${
          data.competencia_ano
        } paga. Limite devolvido: ${formatCurrency(data.total_devolvido || 0)}`
      );

      // atualiza a lista no pai (incrementa refreshKey)
      onRefresh?.();
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Erro ao pagar fatura.";
      toast.error(errorMessage);
    } finally {
      setPagarLoading(false);
    }
  };

  return (
    <div className="rounded-xl shadow-md overflow-hidden border bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--card-text)]">
      {/* Topo com cor do cartão */}
      <div
        className="p-4 text-white flex justify-between items-start"
        style={{ backgroundColor: cor }}
      >
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{nome}</p>
          <p className="text-lg font-semibold tracking-wider">
            **** **** **** {numero}
          </p>
          {isCredito ? (
            <p className="text-sm mt-1">
              Vence dia <strong>{dia_vencimento}</strong> • Fecha{" "}
              <strong>{diasFechamento}</strong> d antes
            </p>
          ) : (
            <p className="text-sm mt-1">Cartão de débito</p>
          )}
        </div>
        <span className="shrink-0 text-xs bg-white/20 px-2 py-1 rounded-md">
          {tipo}
        </span>
      </div>

      {/* Corpo */}
      <div className="p-4">
        {/* Limites (somente crédito) */}
        {isCredito && (
          <>
            <div className="flex justify-between mb-2 text-sm">
              <span>Limite usado</span>
              <span className="font-semibold">
                {percentualUsado.toFixed(1)}%
              </span>
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
          </>
        )}

        {/* Fechamento / Vencimento / Ações */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {/* Fechamento */}
          <div className="min-w-0">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Próximo fechamento
            </div>
            <div className="font-medium text-[var(--card-text)]">
              {format(closeDate, "dd/MM/yyyy")}
            </div>
            <div className="mt-1 text-xs flex items-center gap-1">
              {fechamentoPassou ? (
                <span className="text-yellow-500 flex items-center gap-1">
                  <AlertTriangle size={14} /> fechou há{" "}
                  {Math.abs(diasAteFechamento)}d
                </span>
              ) : (
                <span className="text-[var(--card-text)]/70">
                  {diasAteFechamento}d
                </span>
              )}
            </div>
          </div>

          {/* Vencimento */}
          <div className="min-w-0">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Próximo vencimento
            </div>
            <div className="font-medium text-[var(--card-text)]">
              {format(dueDate, "dd/MM/yyyy")}
            </div>
            <div className="mt-1 text-xs flex items-center gap-1">
              {vencimentoPassou ? (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertTriangle size={14} /> venceu há{" "}
                  {Math.abs(diasAteVencimento)}d
                </span>
              ) : (
                <span className="text-[var(--card-text)]/70">
                  {diasAteVencimento}d
                </span>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-row md:flex-wrap justify-between md:justify-end gap-2">
            {isCredito && (
              <button
                onClick={handlePayInvoice}
                disabled={!fechamentoPassou || pagarLoading}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition cursor-pointer w-full sm:w-auto
                ${
                  !fechamentoPassou || pagarLoading
                    ? "bg-[#00D4D4]/50 text-black/60 cursor-not-allowed"
                    : "bg-[#00D4D4] text-black hover:opacity-90"
                }`}
                title={
                  !fechamentoPassou
                    ? "Só é possível pagar após o fechamento da fatura"
                    : "Pagar fatura vigente"
                }
              >
                <Wallet size={16} />
                {pagarLoading ? "Pagando..." : "Pagar"}
              </button>
            )}

            <div className="flex-1 sm:flex-none w-full sm:w-auto">
              <EditButton
                onClick={() => onEdit(card)}
                title="Editar cartão"
                size="md"
              />
            </div>

            <div className="flex-1 sm:flex-none w-full sm:w-auto">
              <DeleteButton onClick={() => setConfirmOpen(true)} />
            </div>
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
