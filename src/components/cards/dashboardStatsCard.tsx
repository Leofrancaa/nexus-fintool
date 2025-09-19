// src/components/cards/dashboardStatsCard.tsx
"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { apiRequest, tokenManager } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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

export function DashboardCards({ customMonth, customYear, refreshKey }: Props) {
  const [incomes, setIncomes] = useState<IncomeStats>({
    total: 0,
    anterior: 0,
  });
  const [expenses, setExpenses] = useState<ExpenseStats>({
    total: 0,
    anterior: 0,
  });

  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const month = customMonth || String(new Date().getMonth() + 1);
  const year = customYear || String(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Verificar se há token antes de fazer as requisições
        const token = tokenManager.get();
        if (!token) {
          console.error("Token não encontrado");
          router.push("/login");
          return;
        }

        console.log(
          "Fazendo requisições do dashboard com token:",
          token ? "presente" : "ausente"
        );

        // Fazer todas as requisições em paralelo
        const [incomeRes, expenseRes] = await Promise.all([
          apiRequest(`/api/incomes/stats?month=${month}&year=${year}`),
          apiRequest(`/api/expenses/stats?month=${month}&year=${year}`),
        ]);

        // Verificar se todas as responses são válidas
        if (!incomeRes.ok) {
          throw new Error(
            `Erro ao buscar receitas: ${incomeRes.status} ${incomeRes.statusText}`
          );
        }
        if (!expenseRes.ok) {
          throw new Error(
            `Erro ao buscar despesas: ${expenseRes.status} ${expenseRes.statusText}`
          );
        }

        // Processar respostas
        const incomeData = await incomeRes.json();
        const expenseData = await expenseRes.json();

        console.log("Dados recebidos:", {
          incomeData,
          expenseData,
        });

        setIncomes({
          total: Number(incomeData.total || 0),
          anterior: Number(incomeData.anterior || 0),
        });

        setExpenses({
          total: Number(expenseData.total || 0),
          anterior: Number(expenseData.anterior || 0),
        });
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);

        if (err instanceof Error) {
          if (
            err.message.includes("Sessão expirada") ||
            err.message.includes("401")
          ) {
            // Token expirado ou inválido
            tokenManager.remove();
            router.push("/login");
            toast.error("Sessão expirada. Faça login novamente.");
          } else if (err.message.includes("403")) {
            // Token inválido
            tokenManager.remove();
            router.push("/login");
            toast.error("Acesso não autorizado. Faça login novamente.");
          } else {
            toast.error("Erro ao carregar dados do dashboard");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year, refreshKey, router]);

  const saldoAtual = incomes.total - expenses.total;
  const saldoAnterior = incomes.anterior - expenses.anterior;

  // Calcular variação percentual
  const calcVariacao = (
    atual: number,
    anterior: number,
    positivoQuandoMaior: boolean
  ) => {
    if (anterior === 0) return null; // evita divisão por 0

    const delta = atual - anterior;
    const variacao = (delta / Math.abs(anterior)) * 100;
    const isPositiva = positivoQuandoMaior ? delta >= 0 : delta <= 0;

    return {
      texto: `${variacao >= 0 ? "+" : ""}${variacao.toFixed(1)}%`,
      isPositiva,
    };
  };

  const varReceitas = calcVariacao(incomes.total, incomes.anterior, true);
  const varDespesas = calcVariacao(expenses.total, expenses.anterior, false);
  const varSaldo = calcVariacao(saldoAtual, saldoAnterior, true);

  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg border border-[var(--card-border)] animate-pulse"
          >
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {/* Card de Receitas */}
      <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg border border-[var(--card-border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--card-text)] text-sm font-medium">
              Receitas
            </p>
            <p className="text-2xl font-bold text-[var(--card-title)]">
              {incomes.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            {varReceitas && (
              <p
                className={`text-xs flex items-center gap-1 ${
                  varReceitas.isPositiva ? "text-green-600" : "text-red-600"
                }`}
              >
                {varReceitas.isPositiva ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {varReceitas.texto} vs mês anterior
              </p>
            )}
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Card de Despesas */}
      <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg border border-[var(--card-border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--card-text)] text-sm font-medium">
              Despesas
            </p>
            <p className="text-2xl font-bold text-[var(--card-title)]">
              {expenses.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            {varDespesas && (
              <p
                className={`text-xs flex items-center gap-1 ${
                  varDespesas.isPositiva ? "text-green-600" : "text-red-600"
                }`}
              >
                {varDespesas.isPositiva ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {varDespesas.texto} vs mês anterior
              </p>
            )}
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Card de Saldo */}
      <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow-lg border border-[var(--card-border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--card-text)] text-sm font-medium">Saldo</p>
            <p
              className={`text-2xl font-bold ${
                saldoAtual >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {saldoAtual.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            {varSaldo && (
              <p
                className={`text-xs flex items-center gap-1 ${
                  varSaldo.isPositiva ? "text-green-600" : "text-red-600"
                }`}
              >
                {varSaldo.isPositiva ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {varSaldo.texto} vs mês anterior
              </p>
            )}
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
