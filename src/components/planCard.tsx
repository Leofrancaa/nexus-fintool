"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import EditButton from "@/components/ui/editButton";
import DeleteButton from "@/components/ui/deleteButton";
import { ContributeModal } from "./modals/contributeModal";
import { EditPlanModal } from "./modals/editPlanModal";
import ConfirmDialog from "@/components/ui/confirmDialog";

interface Plano {
  id: number;
  nome: string;
  descricao?: string;
  meta: number;
  total_contribuido: number;
  prazo: string;
}

interface PlanCardProps {
  plano: Plano;
  onRefresh?: () => void;
}

export default function PlanCard({ plano, onRefresh }: PlanCardProps) {
  const [editando, setEditando] = useState<Plano | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const progresso = (plano.total_contribuido / plano.meta) * 100;
  const restante = plano.meta - plano.total_contribuido;

  const getStatus = () => {
    if (progresso >= 100) return "Concluído";
    if (progresso >= 70) return "Quase lá";
    if (progresso >= 30) return "Em progresso";
    return "Iniciando";
  };

  const getStatusColor = () => {
    if (progresso >= 100) return "#059669";
    if (progresso >= 70) return "#f59e0b";
    if (progresso >= 30) return "#3b82f6";
    return "#6b7280";
  };

  const getProgressBarColor = () => {
    if (progresso >= 100) return "#10b981";
    if (progresso >= 70) return "#f59e0b";
    if (progresso >= 30) return "#3b82f6";
    return "#6b7280";
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plans/${plano.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Erro ao excluir plano.");
        return;
      }

      toast.success("Plano excluído com sucesso!");
      onRefresh?.();
    } catch {
      toast.error("Erro ao excluir plano.");
    }
  };

  return (
    <>
      <div className="rounded-xl border border-white/10 bg-[#111] p-5 text-white shadow-lg space-y-2 relative">
        {/* Nome e status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{plano.nome}</h3>
            {plano.descricao && (
              <p className="text-sm text-white/50">{plano.descricao}</p>
            )}
          </div>

          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ backgroundColor: getStatusColor(), color: "#fff" }}
          >
            {getStatus()}
          </span>
        </div>

        {/* Barra de progresso */}
        <div>
          <p className="text-sm font-medium text-white/70 mb-1">Progresso</p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(progresso, 100)}%`,
                backgroundColor: getProgressBarColor(),
              }}
            />
          </div>
          <p className="text-sm mt-1 text-right font-bold">
            {progresso.toFixed(1)}%
          </p>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-2 gap-4 text-md">
          <div>
            <p className="text-white/50">Atual</p>
            <p className="text-green-400 font-medium">
              R${" "}
              {plano.total_contribuido.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div>
            <p className="text-white/50">Meta</p>
            <p className="text-white font-medium">
              R${" "}
              {plano.meta.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div>
            <p className="text-white/50">Restante</p>
            <p className="text-red-400 font-medium">
              R${" "}
              {restante.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div>
            <p className="text-white/50">Prazo</p>
            <p className="text-white font-medium">
              {new Date(plano.prazo).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <ContributeModal planId={plano.id} onContributed={onRefresh} />

          <div className="flex items-center gap-2">
            <EditButton onClick={() => setEditando(plano)} />
            <>
              <DeleteButton onClick={() => setConfirmOpen(true)} />
              <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Excluir plano"
                description="Tem certeza que deseja excluir este plano? Essa ação não poderá ser desfeita."
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
              />
            </>
          </div>
        </div>
      </div>

      {/* Modal de edição */}
      {editando && (
        <EditPlanModal
          plano={editando}
          onClose={() => setEditando(null)}
          onUpdated={onRefresh}
        />
      )}
    </>
  );
}
