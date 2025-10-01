"use client";

import { Threshold } from "@/types/threshold";
import { Progress } from "@/components/ui/progress";
import { BadgeAlert } from "lucide-react";
import EditButton from "@/components/ui/editButton";
import DeleteButton from "@/components/ui/deleteButton";

interface Props {
  threshold: Threshold;
  gastoAtual: number;
  onEdit: (threshold: Threshold) => void;
  onDelete: (threshold: Threshold) => void;
}

export default function ThresholdCard({
  threshold,
  gastoAtual,
  onEdit,
  onDelete,
}: Props) {
  const limite = threshold.valor;
  const excedeu = gastoAtual - limite;
  const porcentagem = (gastoAtual / limite) * 100;
  const corCategoria = threshold.categoria.cor;
  const passouDoLimite = gastoAtual > limite;

  return (
    <div
      className="flex flex-col gap-2 rounded-lg p-4 shadow-md"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        color: "var(--card-text)",
      }}
    >
      {/* Topo com nome e alerta */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: corCategoria }}
          />
          <p className="font-semibold text-lg">{threshold.categoria.nome}</p>
        </div>

        {passouDoLimite && <BadgeAlert className="text-red-500 w-5 h-5" />}
      </div>

      <div className="text-md mt-2 text-[var(--card-text)]">
        <div className="flex justify-between">
          <span className="text-md">Utilizado</span>
          <span
            className={`font-semibold ${
              passouDoLimite ? "text-red-500" : "text-[var(--card-text)]"
            }`}
          >
            {porcentagem.toFixed(1)}%
          </span>
        </div>

        <Progress
          value={Math.min(porcentagem, 100)}
          className="h-2 mt-1 mb-2"
        />

        {passouDoLimite && (
          <p className="text-xs text-red-500 -mt-1 mb-2">
            Limite excedido em R$ {excedeu.toFixed(2).replace(".", ",")}
          </p>
        )}

        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col gap-[2px] text-md text-[var(--card-text)]">
            <span>
              Gasto:{" "}
              <span className="text-red-500 font-medium">
                R$ {gastoAtual.toFixed(2).replace(".", ",")}
              </span>
            </span>
            <span>
              Limite:{" "}
              <span className="text-[var(--card-text)] font-semibold">
                R$ {limite.toFixed(2).replace(".", ",")}
              </span>
            </span>
            {passouDoLimite && (
              <span>
                Excedeu:{" "}
                <span className="text-red-500 font-medium">
                  R$ {excedeu.toFixed(2).replace(".", ",")}
                </span>
              </span>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <DeleteButton onClick={() => onDelete(threshold)} />
            <EditButton
              onClick={() => onEdit(threshold)}
              title="Editar limite"
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
