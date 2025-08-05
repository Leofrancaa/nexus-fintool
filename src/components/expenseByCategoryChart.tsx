"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
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

export function ExpenseByCategoryChart({ mes, ano, refreshKey }: Props) {
  const [dados, setDados] = useState<CategoriaResumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mes || !ano || isNaN(mes) || isNaN(ano)) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/resumo-categorias?mes=${mes}&ano=${ano}`,
          { credentials: "include" }
        );
        const json = await res.json();
        setDados(json);
      } catch (error) {
        console.error("Erro ao carregar gráfico de categorias", error);
        toast.error("Erro ao carregar gráfico de categorias");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mes, ano, refreshKey]);

  if (loading) return <p className="text-white">Carregando gráfico...</p>;

  if (dados.length === 0)
    return <p className="text-white">Nenhum dado encontrado.</p>;

  return (
    <div className="bg-[#111] p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-white text-lg font-semibold mb-4">
        Gastos por Categoria
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dados}>
          <XAxis dataKey="nome" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            formatter={(value: number) =>
              value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }
            contentStyle={{
              backgroundColor: "#1f1f1f",
              borderColor: "#444",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#ffffff" }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {dados.map((item, index) => (
              <Cell key={index} fill={item.cor || "#22d3ee"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
