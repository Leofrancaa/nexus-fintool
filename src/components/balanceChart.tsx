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

export default function BalanceChart() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [despRes, recRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/despesas/mes`, {
          credentials: "include",
        }),
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

      setData(merged);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar gráfico de balanço");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Carregando gráfico...</p>;

  return (
    <div className="bg-[#111] p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-white text-lg font-semibold mb-4">
        Despesas vs Receitas
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="mes" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f1f1f",
              borderColor: "#444",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#ffffff" }}
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
