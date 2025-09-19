"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface MonthlyData {
  mes: string;
  despesas: number;
  receitas: number;
}

interface ReceitaOuDespesa {
  mes: string;
  total: number;
}

interface Props {
  refreshKey?: number; // ⬅️ novo (opcional p/ não quebrar usos antigos)
}

export default function BalanceChart({ refreshKey = 0 }: Props) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [despRes, recRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/despesas/mes`,
            {
              credentials: "include",
            }
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/incomes/receitas/mes`, {
            credentials: "include",
          }),
        ]);

        if (!despRes.ok || !recRes.ok) throw new Error("Erro ao buscar dados");

        const despesas: ReceitaOuDespesa[] = await despRes.json();
        const receitas: ReceitaOuDespesa[] = await recRes.json();

        const meses = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];

        const merged: MonthlyData[] = meses.map((mes) => {
          const receita = receitas.find((r) => r.mes === mes)?.total || 0;
          const despesa = despesas.find((d) => d.mes === mes)?.total || 0;
          return { mes, receitas: receita, despesas: despesa };
        });

        if (!cancelled) setData(merged);
      } catch (err) {
        console.error(err);
        if (!cancelled) toast.error("Erro ao carregar gráfico de balanço");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]); // ⬅️ recarrega quando o refreshKey mudar

  if (loading) return <p>Carregando gráfico...</p>;

  return (
    <div className="bg-[var(--chart-bg)] p-6 rounded-xl shadow-lg w-full border border-[var(--card-border)]">
      <h2 className="text-[var(--chart-title)] text-lg font-semibold mb-4">
        Despesas vs Receitas
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="mes" stroke="var(--chart-axis)" />
          <YAxis stroke="var(--chart-axis)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--chart-tooltip-bg)",
              borderColor: "var(--chart-tooltip-border)",
              borderRadius: 8,
            }}
            labelStyle={{ color: "var(--chart-tooltip-label)" }}
            formatter={(value: number) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
          />
          <Line
            type="monotone"
            dataKey="receitas"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 5, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="despesas"
            stroke="#EF4444"
            strokeWidth={2}
            dot={{ r: 5, fill: "#EF4444", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
