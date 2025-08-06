"use client";

import { useEffect, useState } from "react";
import { DollarSign, Activity, TrendingUp, Divide } from "lucide-react";

interface Stats {
  totalInvestido: number;
  totalSimulacoes: number;
  valorAtual: number;
  rentabilidadeMedia: number;
}

interface Props {
  customMonth?: string;
  customYear?: string;
  refreshKey: number;
  assetKey: string;
}

export function InvestmentStatsCards({
  customMonth,
  customYear,
  refreshKey,
  assetKey,
}: Props) {
  const [stats, setStats] = useState<Stats>({
    totalInvestido: 0,
    totalSimulacoes: 0,
    valorAtual: 0,
    rentabilidadeMedia: 0,
  });

  const monthToUse = customMonth || String(new Date().getMonth() + 1);
  const yearToUse = customYear || String(new Date().getFullYear());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_URL}/api/investments/stats`
        );
        url.searchParams.set("month", monthToUse);
        url.searchParams.set("year", yearToUse);

        if (assetKey && assetKey !== "todos") {
          url.searchParams.set("asset", assetKey);
        }

        const res = await fetch(url.toString(), {
          credentials: "include",
        });

        const data = await res.json();
        setStats({
          totalInvestido: Number(data.totalInvestido || 0),
          totalSimulacoes: Number(data.totalSimulacoes || 0),
          valorAtual: Number(data.valorAtual || 0),
          rentabilidadeMedia: Number(data.rentabilidadeMedia || 0),
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas de investimentos:", error);
      }
    };

    fetchStats();
  }, [monthToUse, yearToUse, refreshKey, assetKey]);

  const cards = [
    {
      title: "Total Investido",
      value: `R$ ${Number(stats.totalInvestido).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      icon: <DollarSign className="text-green-400" />,
      bg: "bg-[var(--card-icon-bg-green)]",
    },
    {
      title: "Simulações",
      value: stats.totalSimulacoes,
      icon: <Activity className="text-cyan-400" />,
      bg: "bg-[var(--card-icon-bg-neutral)]",
    },
    {
      title: "Valor Atual",
      value: `R$ ${Number(stats.valorAtual).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      icon: <TrendingUp className="text-yellow-300" />,
      bg: "bg-[var(--card-icon-bg-yellow)]",
    },
    {
      title: "Rentabilidade Média",
      value:
        stats.totalSimulacoes > 0 && !isNaN(Number(stats.rentabilidadeMedia))
          ? `${Number(stats.rentabilidadeMedia).toFixed(2)}%`
          : "-",
      icon: <Divide className="text-blue-400" />,
      bg: "bg-[var(--card-icon-bg-blue)]",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl p-5 border shadow-md"
          style={{
            backgroundColor: "var(--stats-card-bg)",
            borderColor: "var(--card-border)",
            color: "var(--card-text)",
          }}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg}`}
          >
            {card.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {card.title}
            </span>
            <span className="text-xl font-bold">{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
