"use client";

import { useEffect, useState } from "react";
import { DollarSign, CalendarDays, CreditCard, Divide } from "lucide-react";

interface Stats {
  total: number;
  fixas: number;
  transacoes: number;
  media: number;
}

interface Props {
  customMonth?: string;
  customYear?: string;
}

export function ExpenseStatsCards({ customMonth, customYear }: Props) {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    fixas: 0,
    transacoes: 0,
    media: 0,
  });

  const monthToUse = customMonth || String(new Date().getMonth() + 1);
  const yearToUse = customYear || String(new Date().getFullYear());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/stats?month=${monthToUse}&year=${yearToUse}`,
          { credentials: "include" }
        );

        const data = await res.json();
        console.log("📊 Dados recebidos:", data);
        setStats({
          total: Number(data.total || 0),
          fixas: Number(data.fixas || 0),
          transacoes: Number(data.transacoes || 0),
          media: Number(data.media || 0),
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas de despesas:", error);
      }
    };

    fetchStats();
  }, [monthToUse, yearToUse]);

  const cards = [
    {
      title: "Total do Mês",
      value: `R$ ${Number(stats.total).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      icon: <DollarSign className="text-red-500" />,
      bg: "bg-red-900/30",
    },
    {
      title: "Despesas Fixas",
      value: stats.fixas,
      icon: <CalendarDays className="text-yellow-400" />,
      bg: "bg-yellow-900/30",
    },
    {
      title: "Transações",
      value: stats.transacoes,
      icon: <CreditCard className="text-blue-500" />,
      bg: "bg-blue-900/30",
    },
    {
      title: "Média por Despesa",
      value:
        stats.transacoes > 0 && !isNaN(Number(stats.media))
          ? `R$ ${Number(stats.media).toFixed(2)}`
          : "-",
      icon: <Divide className="text-green-400" />,
      bg: "bg-green-900/30",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-[#18181b] rounded-xl p-5 border border-[#262626]"
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg}`}
          >
            {card.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{card.title}</span>
            <span className="text-xl font-bold text-white">{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
