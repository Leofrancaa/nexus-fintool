"use client";

import { useEffect, useState } from "react";
import { DollarSign, CalendarDays, CreditCard, Divide } from "lucide-react";
import { apiRequest } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Stats {
  total: number;
  fixas: number;
  transacoes: number;
  media: number;
}

interface Props {
  customMonth?: string;
  customYear?: string;
  refreshKey: number;
  categoryId: string;
}

export function ExpenseStatsCards({
  customMonth,
  customYear,
  refreshKey,
  categoryId,
}: Props) {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    fixas: 0,
    transacoes: 0,
    media: 0,
  });

  const router = useRouter();
  const monthToUse = customMonth || String(new Date().getMonth() + 1);
  const yearToUse = customYear || String(new Date().getFullYear());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let endpoint = `/api/expenses/stats?month=${monthToUse}&year=${yearToUse}`;

        if (categoryId && categoryId !== "todas") {
          endpoint += `&categoryId=${categoryId}`;
        }

        const res = await apiRequest(endpoint);
        if (!res.ok) throw new Error("Erro ao buscar estatísticas");

        const data = await res.json();
        const statsData = data.data || data;
        setStats({
          total: Number(statsData.total || 0),
          fixas: Number(statsData.fixas || 0),
          transacoes: Number(statsData.transacoes || 0),
          media: Number(statsData.media || 0),
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas de despesas:", error);
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
      icon: <DollarSign className="text-red-500" />,
      bg: "bg-[var(--card-icon-bg-red)]",
    },
    {
      title: "Despesas Fixas",
      value: stats.fixas,
      icon: <CalendarDays className="text-yellow-400" />,
      bg: "bg-[var(--card-icon-bg-yellow)]",
    },
    {
      title: "Transações",
      value: stats.transacoes,
      icon: <CreditCard className="text-blue-500" />,
      bg: "bg-[var(--card-icon-bg-blue)]",
    },
    {
      title: "Média por Despesa",
      value:
        stats.transacoes > 0 && !isNaN(Number(stats.media))
          ? `R$ ${Number(stats.media).toFixed(2)}`
          : "-",
      icon: <Divide className="text-green-400" />,
      bg: "bg-[var(--card-icon-bg-green)]",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
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
            <span className="text-xl font-bold">{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
