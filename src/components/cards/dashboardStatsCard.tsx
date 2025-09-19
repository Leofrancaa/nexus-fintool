"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";
import { apiRequest } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Props {
  customMonth?: string;
  customYear?: string;
  refreshKey: number;
}

interface IncomeStats {
  total: number;
  anterior: number;
}

interface ExpenseStats {
  total: number;
  anterior: number;
}

interface InvestmentStats {
  totalInvestido: number;
  anterior: number;
}

export function DashboardCards({ customMonth, customYear, refreshKey }: Props) {
  const [incomes, setIncomes] = useState<IncomeStats>({
    total: 0,
    anterior: 0,
  });
  const [expenses, setExpenses] = useState<ExpenseStats>({
    total: 0,
    anterior: 0,
  });
  const [investments, setInvestments] = useState<InvestmentStats>({
    totalInvestido: 0,
    anterior: 0,
  });

  const router = useRouter();
  const month = customMonth || String(new Date().getMonth() + 1);
  const year = customYear || String(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeRes = await apiRequest(
          `/api/incomes/stats?month=${month}&year=${year}`
        );
        if (!incomeRes.ok) throw new Error("Erro ao buscar receitas");
        const incomeData = await incomeRes.json();

        const expenseRes = await apiRequest(
          `/api/expenses/stats?month=${month}&year=${year}`
        );
        if (!expenseRes.ok) throw new Error("Erro ao buscar despesas");
        const expenseData = await expenseRes.json();

        const investmentRes = await apiRequest(
          `/api/investments/stats?month=${month}&year=${year}`
        );
        if (!investmentRes.ok) throw new Error("Erro ao buscar investimentos");
        const investmentData = await investmentRes.json();

        setIncomes({
          total: Number(incomeData.total || 0),
          anterior: Number(incomeData.anterior || 0),
        });

        setExpenses({
          total: Number(expenseData.total || 0),
          anterior: Number(expenseData.anterior || 0),
        });

        setInvestments({
          totalInvestido: Number(investmentData.totalInvestido || 0),
          anterior: Number(investmentData.anterior || 0),
        });
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        if (err instanceof Error && err.message.includes("Sessão expirada")) {
          router.push("/login");
        }
      }
    };

    fetchData();
  }, [month, year, refreshKey, router]);

  const saldoAtual = incomes.total - expenses.total;
  const saldoAnterior = incomes.anterior - expenses.anterior;

  // substitua a sua calcVariação por esta
  const calcVariação = (
    atual: number,
    anterior: number,
    positivoQuandoMaior: boolean
  ) => {
    if (anterior === 0) return null; // evita divisão por 0

    const delta = atual - anterior; // direção real da mudança
    const variacao = (delta / Math.abs(anterior)) * 100; // base sempre positiva
    const isPositiva = positivoQuandoMaior ? delta >= 0 : delta <= 0;

    return {
      texto: `${variacao >= 0 ? "+" : ""}${variacao.toFixed(
        0
      )}% em relação ao mês anterior`,
      classe: isPositiva ? "text-green-500" : "text-red-500",
      icone: isPositiva ? "↑" : "↓",
    };
  };

  const cards = [
    {
      title: "Saldo Atual",
      value: `R$ ${saldoAtual.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      comparacao: calcVariação(saldoAtual, saldoAnterior, true),
      icon: <Wallet className="text-[var(--card-icon)]" />,
      bg: "bg-[var(--card-icon-bg-neutral)]",
    },
    {
      title: "Receitas do Mês",
      value: `R$ ${incomes.total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      comparacao: calcVariação(incomes.total, incomes.anterior, true),
      icon: <TrendingUp className="text-green-600" />,
      bg: "bg-[var(--card-icon-bg-green)]",
    },
    {
      title: "Despesas do Mês",
      value: `R$ ${expenses.total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      comparacao: calcVariação(expenses.total, expenses.anterior, false),
      icon: <TrendingDown className="text-red-500" />,
      bg: "bg-[var(--card-icon-bg-red)]",
    },
    {
      title: "Investimentos",
      value: `R$ ${investments.totalInvestido.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      comparacao: calcVariação(
        investments.totalInvestido,
        investments.anterior,
        true
      ),
      icon: <PiggyBank className="text-yellow-500" />,
      bg: "bg-[var(--card-icon-bg-yellow)]",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="flex flex-col justify-between bg-[var(--card-bg)] text-[var(--card-text)] border border-[var(--card-border)] rounded-xl p-5 h-full"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg}`}
            >
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                {card.title}
              </span>
              <span className="text-xl font-bold">{card.value}</span>
            </div>
          </div>
          {card.comparacao && (
            <div
              className={`mt-3 text-sm flex items-center gap-1 ${card.comparacao.classe}`}
            >
              <span className="text-xs">{card.comparacao.icone}</span>
              <span>{card.comparacao.texto}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
