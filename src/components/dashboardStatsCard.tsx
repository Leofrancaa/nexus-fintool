"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";

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

  const month = customMonth || String(new Date().getMonth() + 1);
  const year = customYear || String(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomeRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/incomes/stats?month=${month}&year=${year}`,
          { credentials: "include" }
        );
        const incomeData = await incomeRes.json();

        const expenseRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/stats?month=${month}&year=${year}`,
          { credentials: "include" }
        );
        const expenseData = await expenseRes.json();

        const investmentRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/investments/stats?month=${month}&year=${year}`,
          { credentials: "include" }
        );
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
      }
    };

    fetchData();
  }, [month, year, refreshKey]);

  const saldoAtual = incomes.total - expenses.total;
  const saldoAnterior = incomes.anterior - expenses.anterior;

  const calcVariação = (
    atual: number,
    anterior: number,
    positivoQuandoMaior: boolean
  ) => {
    if (anterior === 0) return null;
    const variacao = ((atual - anterior) / anterior) * 100;
    const isPositiva = positivoQuandoMaior ? variacao >= 0 : variacao <= 0;
    const texto = `${variacao >= 0 ? "+" : ""}${variacao.toFixed(
      0
    )}% em relação ao mês anterior`;
    return {
      texto,
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
      comparacao: calcVariação(saldoAtual, saldoAnterior, true), // saldo maior = bom
      icon: <Wallet className="text-white" />,
      bg: "bg-white/20",
    },
    {
      title: "Receitas do Mês",
      value: `R$ ${incomes.total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      comparacao: calcVariação(incomes.total, incomes.anterior, true), // receita maior = bom
      icon: <TrendingUp className="text-green-400" />,
      bg: "bg-green-900/30",
    },
    {
      title: "Despesas do Mês",
      value: `R$ ${expenses.total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      comparacao: calcVariação(expenses.total, expenses.anterior, false), // despesa maior = ruim
      icon: <TrendingDown className="text-red-400" />,
      bg: "bg-red-900/30",
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
      ), // investimento maior = bom
      icon: <PiggyBank className="text-yellow-400" />,
      bg: "bg-yellow-900/30",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="flex flex-col justify-between bg-[#18181b] rounded-xl p-5 border border-[#262626] h-full"
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
              <span className="text-xl font-bold text-white">{card.value}</span>
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
