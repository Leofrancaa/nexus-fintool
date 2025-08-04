"use client";

import EditButton from "@/components/ui/editButton";
import DeleteButton from "@/components/ui/deleteButton";
import { ContributeModal } from "./modals/contributeModal";

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
  const progresso = (plano.total_contribuido / plano.meta) * 100;
  const restante = plano.meta - plano.total_contribuido;

  const getStatus = () => {
    if (progresso >= 100) return "Concluído";
    if (progresso >= 70) return "Quase lá";
    if (progresso >= 30) return "Em progresso";
    return "Iniciando";
  };

  const getStatusColor = () => {
    if (progresso >= 100) return "#059669"; // verde
    if (progresso >= 70) return "#f59e0b"; // amarelo
    if (progresso >= 30) return "#3b82f6"; // azul
    return "#6b7280"; // cinza
  };

  const getProgressBarColor = () => {
    if (progresso >= 100) return "#10b981"; // verde claro
    if (progresso >= 70) return "#f59e0b"; // amarelo
    if (progresso >= 30) return "#3b82f6"; // azul
    return "#6b7280"; // cinza
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#111] p-5 text-white shadow-lg space-y-4 relative">
      {/* Nome e status */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{plano.nome}</h3>
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
      <div className="grid grid-cols-2 gap-4 text-sm">
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
            {plano.meta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <p className="text-white/50">Restante</p>
          <p className="text-red-400 font-medium">
            R$ {restante.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
          <EditButton onClick={() => console.log("Editar plano")} />
          <DeleteButton onClick={() => console.log("Excluir plano")} />
        </div>
      </div>
    </div>
  );
}
