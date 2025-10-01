"use client";

import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import EditButton from "@/components/ui/editButton";
import DeleteButton from "@/components/ui/deleteButton";

interface Goal {
  id: number;
  nome: string;
  tipo: string;
  valor_alvo: number;
  valor_atual: number;
  progresso: number;
  mes: number;
  ano: number;
  categoria?: {
    id: number;
    nome: string;
    cor: string;
  };
}

interface Props {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
}

export default function GoalCard({ goal, onEdit, onDelete }: Props) {
  const porcentagem = goal.progresso;
  const atingido = porcentagem >= 100;

  return (
    <div
      className="flex flex-col gap-2 rounded-lg p-4 shadow-md"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        color: "var(--card-text)",
      }}
    >
      {/* Topo com nome e ícone */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {goal.categoria && (
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: goal.categoria.cor }}
            />
          )}
          <Target className={`w-4 h-4 ${atingido ? "text-green-500" : "text-blue-500"}`} />
          <p className="font-semibold text-lg">{goal.nome}</p>
        </div>
      </div>

      {goal.categoria && (
        <p className="text-xs text-[var(--filter-placeholder)]">{goal.categoria.nome}</p>
      )}

      <div className="text-md mt-2 text-[var(--card-text)]">
        <div className="flex justify-between">
          <span className="text-md">Progresso</span>
          <span
            className={`font-semibold ${
              atingido ? "text-green-500" : "text-blue-500"
            }`}
          >
            {porcentagem.toFixed(1)}%
          </span>
        </div>

        <Progress
          value={Math.min(porcentagem, 100)}
          className="h-2 mt-1 mb-2"
        />

        {atingido && (
          <p className="text-xs text-green-500 -mt-1 mb-2">
            Meta atingida! 🎉
          </p>
        )}

        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col gap-[2px] text-md text-[var(--card-text)]">
            <span>
              Atual:{" "}
              <span className="text-green-500 font-medium">
                R$ {goal.valor_atual.toFixed(2).replace(".", ",")}
              </span>
            </span>
            <span>
              Meta:{" "}
              <span className="text-[var(--card-text)] font-semibold">
                R$ {goal.valor_alvo.toFixed(2).replace(".", ",")}
              </span>
            </span>
            <span className="text-xs text-[var(--filter-placeholder)]">
              {goal.mes}/{goal.ano}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <DeleteButton onClick={() => onDelete(goal)} />
            <EditButton
              onClick={() => onEdit(goal)}
              title="Editar meta"
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
