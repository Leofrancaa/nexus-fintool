"use client";

import { useEffect, useState } from "react";
import { DollarSign, ListOrdered, Divide } from "lucide-react";
import { apiRequest } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Stats {
  total: number;
  transacoes: number;
  media: number;
}

interface Props {
  customMonth?: string;
  customYear?: string;
  refreshKey: number;
  categoryId: string;
}

export function IncomeStatsCards({
  customMonth,
  customYear,
  refreshKey,
  categoryId,
}: Props) {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    transacoes: 0,
    media: 0,
  });

  const router = useRouter();
  const monthToUse = customMonth || String(new Date().getMonth() + 1);
  const yearToUse = customYear || String(new Date().getFullYear());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let endpoint = `/api/incomes/stats?month=${monthToUse}&year=${yearToUse}`;

        if (categoryId && categoryId !== "todas") {
          endpoint += `&categoryId=${categoryId}`;
        }

        const res = await apiRequest(endpoint);
        if (!res.ok) throw new Error("Erro ao buscar estatísticas");

        const data = await res.json();
        const statsData = data.data || data;
        setStats({
          total: Number(statsData.total || 0),
          transacoes: Number(statsData.transacoes || 0),
          media: Number(statsData.media || 0),
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas de receitas:", error);
        if (
          error instanceof Error &&
          error.message.includes("Sessão expirada")
        ) {
          router.push("/login");
        }
      }
    };

    fetchStats();
  }, [monthToUse, yearToUse, refreshKey, categoryId, router]);

  const cards = [
    {
      title: "Total do Mês",
      value: `R$ ${Number(stats.total).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      icon: <DollarSign className="text-green-400" />,
      bg: "bg-[var(--card-icon-bg-green)]",
    },
    {
      title: "Receitas Registradas",
      value: stats.transacoes,
      icon: <ListOrdered className="text-cyan-400" />,
      bg: "bg-[var(--card-icon-bg-neutral)]",
    },
    {
      title: "Média por Receita",
      value:
        stats.transacoes > 0 && !isNaN(Number(stats.media))
          ? `R$ ${Number(stats.media).toFixed(2)}`
          : "-",
      icon: <Divide className="text-yellow-300" />,
      bg: "bg-[var(--card-icon-bg-yellow)]",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-[var(--card-bg)] text-[var(--card-text)] rounded-xl p-5 border border-[var(--card-border)]"
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg}`}
          >
            {card.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{card.title}</span>
            <span className="text-xl font-bold text-[var(--card-text)]">
              {card.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
