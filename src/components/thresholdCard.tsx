"use client";

import { Threshold } from "@/types/threshold";
import { Progress } from "@/components/ui/progress";
import { BadgeAlert } from "lucide-react";
import EditButton from "@/components/ui/editButton";

interface Props {
  threshold: Threshold;
  gastoAtual: number;
  onEdit: (threshold: Threshold) => void;
}

export default function ThresholdCard({
  threshold,
  gastoAtual,
  onEdit,
}: Props) {
  const limite = threshold.valor;
  const excedeu = gastoAtual - limite;
  const porcentagem = (gastoAtual / limite) * 100;
  const corCategoria = threshold.categoria.cor;
  const passouDoLimite = gastoAtual > limite;

  return (
    <div className="flex flex-col gap-2 border border-white/10 rounded-lg p-4 bg-[#1B1B1B] shadow-md text-white">
      {/* Topo com nome e alerta */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: corCategoria }}
          />
          <p className="font-semibold">{threshold.categoria.nome}</p>
        </div>

        {passouDoLimite && <BadgeAlert className="text-red-500 w-5 h-5" />}
      </div>

      <div className="text-sm mt-2 text-gray-300">
        <div className="flex justify-between">
          <span>Utilizado</span>
          <span className={passouDoLimite ? "text-red-500 font-bold" : ""}>
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
          <div className="flex flex-col gap-[2px]">
            <span>
              Gasto:{" "}
              <span className="text-red-400 font-medium">
                R$ {gastoAtual.toFixed(2).replace(".", ",")}
              </span>
            </span>
            <span>
              Limite:{" "}
              <span className="text-white font-semibold">
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

          {/* Botão de editar à direita */}
          <EditButton
            onClick={() => onEdit(threshold)}
            title="Editar limite"
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
