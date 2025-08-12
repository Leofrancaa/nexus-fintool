"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-hot-toast";

interface CategoriaResumo {
  nome: string;
  cor: string;
  total: number;
  quantidade: number;
  percentual: number;
}

interface Props {
  mes: number;
  ano: number;
  refreshKey: number;
}

export function IncomeByCategoryPieChart({ mes, ano, refreshKey }: Props) {
  const [dados, setDados] = useState<CategoriaResumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mes || !ano || isNaN(mes) || isNaN(ano)) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/incomes/resumo-categorias?mes=${mes}&ano=${ano}`,
          { credentials: "include" }
        );
        const json = await res.json();
        setDados(json);
      } catch (error) {
        console.error("Erro ao carregar gráfico de receitas", error);
        toast.error("Erro ao carregar gráfico de receitas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mes, ano, refreshKey]);

  if (loading)
    return <p className="text-[var(--chart-title)]">Carregando gráfico...</p>;

  if (dados.length === 0)
    return (
      <p className="text-[var(--chart-title)]">Nenhuma receita encontrada</p>
    );

  return (
    <div className="bg-[var(--chart-bg)] p-6 rounded-xl shadow-lg w-full lg:max-w-[35%] flex flex-col lg:flex-row gap-2 border border-[var(--card-border)]">
      <div className="flex-1">
        <h2 className="text-[var(--chart-title)] text-lg font-semibold mb-4">
          Receitas por Categoria
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dados}
              dataKey="total"
              nameKey="nome"
              innerRadius={70}
              outerRadius={110}
              stroke="var(--chart-stroke)"
            >
              {dados.map((item, index) => (
                <Cell key={index} fill={item.cor || "#22d3ee"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `R$ ${value.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`,
                name,
              ]}
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-bg)",
                borderColor: "var(--chart-tooltip-border)",
                borderRadius: 8,
              }}
              labelStyle={{ color: "var(--chart-tooltip-label)" }}
              itemStyle={{ color: "var(--chart-tooltip-item)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Legenda */}
      <div className="flex flex-col justify-center gap-3 text-sm text-[var(--chart-legend-text)] w-full lg:w-[40%] ">
        {dados.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b pb-2"
            style={{ borderColor: "var(--chart-legend-border)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: item.cor || "#22d3ee" }}
              />
              <span className="font-medium">{item.nome}</span>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-bold">
                {item.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.percentual.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
