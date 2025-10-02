"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/auth";
import { CreditCard, Target, AlertTriangle } from "lucide-react";

interface Card {
  id: number;
  nome: string;
  gasto_total: number;
  limite: number;
}

interface Plan {
  id: number;
  nome: string;
  meta: number;
  total_contribuido: number;
  progresso: number;
}

interface ThresholdAlert {
  threshold_id: number;
  category_name: string;
  category_color: string;
  limit_value: number;
  current_spending: number;
  percentage_used: number;
  remaining: number;
  is_exceeded: boolean;
  alert_level: "safe" | "warning" | "danger" | "exceeded";
}

interface Goal {
  id: number;
  nome: string;
  valor_alvo: number;
  valor_atual: number;
  progresso: number;
  tipo: string;
}

interface Props {
  customMonth: string;
  customYear: string;
  refreshKey: number;
  onlyAlerts?: boolean;
  onlyCards?: boolean;
  onlyGoals?: boolean;
}

export function DashboardInsightsCard({ customMonth, customYear, refreshKey, onlyAlerts, onlyCards, onlyGoals }: Props) {
  const [topCard, setTopCard] = useState<Card | null>(null);
  const [closestPlan, setClosestPlan] = useState<Plan | null>(null);
  const [exceededThresholds, setExceededThresholds] = useState<ThresholdAlert[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);

        // Buscar cartões
        const cardsRes = await apiRequest("/api/cards");
        const cardsData = await cardsRes.json();
        const cards: Card[] = cardsData.data || [];

        // Encontrar cartão com mais gasto
        if (cards.length > 0) {
          const sorted = cards.sort((a, b) => b.gasto_total - a.gasto_total);
          setTopCard(sorted[0]);
        }

        // Buscar planos
        const plansRes = await apiRequest("/api/plans");
        const plansData = await plansRes.json();
        const plans: Plan[] = plansData.data || [];

        // Encontrar plano mais próximo de conclusão
        if (plans.length > 0) {
          const sorted = plans.sort((a, b) => b.progresso - a.progresso);
          setClosestPlan(sorted[0]);
        }

        // Buscar alertas de limites
        const thresholdsRes = await apiRequest(
          `/api/thresholds/alerts?mes=${customMonth}&ano=${customYear}`
        );
        const thresholdsData = await thresholdsRes.json();
        const alerts: ThresholdAlert[] = thresholdsData.data || [];

        // Filtrar apenas limites ultrapassados
        const exceeded = alerts.filter((t) => t.is_exceeded);
        setExceededThresholds(exceeded);

        // Buscar metas
        const goalsRes = await apiRequest(`/api/goals?mes=${customMonth}&ano=${customYear}`);
        const goalsData = await goalsRes.json();
        const goalsArray: Goal[] = goalsData.data || [];
        setGoals(goalsArray);
      } catch (error) {
        console.error("Erro ao carregar insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [customMonth, customYear, refreshKey]);

  if (loading) {
    return (
      <div className="w-full space-y-3">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Cards de Metas */}
      {onlyGoals && (
        goals.length > 0 ? (
          <div className={`flex flex-col ${goals.length === 1 ? 'h-full' : 'h-full'} gap-3`}>
            {goals.slice(0, 2).map((goal) => (
              <div
                key={goal.id}
                className={`bg-blue-500/10 border border-blue-500/50 rounded-xl p-3 flex items-center justify-center gap-2 ${goals.length === 1 ? 'h-full' : 'flex-1'}`}
              >
                <Target className={`text-blue-500 flex-shrink-0 ${goals.length === 1 ? 'w-5 h-5' : 'w-4 h-4'}`} />
                <div className="flex-1">
                  <p className={`font-semibold text-blue-500 ${goals.length === 1 ? 'text-sm' : 'text-xs'}`}>
                    {goal.nome}
                  </p>
                  <p className={`text-[var(--card-text)] ${goals.length === 1 ? 'text-sm' : 'text-xs'}`}>
                    {goal.progresso.toFixed(1)}% ({goal.valor_atual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} / {goal.valor_alvo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-full gap-3">
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-3 flex items-center justify-center gap-2 h-full">
              <Target className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <p className="text-sm text-[var(--card-text)] text-center">
                <strong>Defina suas metas!</strong> Configure metas de gastos mensais para controlar melhor suas finanças.
              </p>
            </div>
          </div>
        )
      )}

      {/* Alertas de limites ultrapassados */}
      {!onlyCards && !onlyGoals && (
        exceededThresholds.length > 0 ? (
          <div className={`flex flex-col ${exceededThresholds.length === 1 ? 'h-full' : 'h-full'} gap-3`}>
            {exceededThresholds.map((threshold) => (
              <div
                key={threshold.threshold_id}
                className={`bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center justify-center gap-2 ${exceededThresholds.length === 1 ? 'h-full' : 'flex-1'}`}
              >
                <AlertTriangle className={`text-red-500 flex-shrink-0 ${exceededThresholds.length === 1 ? 'w-5 h-5' : 'w-4 h-4'}`} />
                <p className={`text-[var(--card-text)] ${exceededThresholds.length === 1 ? 'text-sm' : 'text-xs'}`}>
                  <strong>{threshold.category_name}</strong> ultrapassou o limite em{" "}
                  <strong className="text-red-500">
                    {((threshold.percentage_used || 0) - 100).toFixed(1)}%
                  </strong>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-full gap-3">
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-3 flex items-center justify-center gap-2 h-full">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <p className="text-sm text-[var(--card-text)] text-center">
                <strong>Configure limites!</strong> Defina limites de gastos por categoria para receber alertas.
              </p>
            </div>
          </div>
        )
      )}

      {/* Cards de insights */}
      {!onlyAlerts && !onlyGoals && onlyCards && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Cartão mais usado */}
        {topCard && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <CreditCard className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--card-text)]">
                Cartão mais usado
              </h3>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--card-text)]">
                {topCard.nome}
              </p>
              <p className="text-sm text-[var(--card-text)]/70 mt-1">
                Gasto total:{" "}
                <span className="font-semibold text-blue-500">
                  {(topCard.gasto_total || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </p>
              <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      ((topCard.gasto_total || 0) / (topCard.limite || 1)) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-[var(--card-text)]/60 mt-2">
                {(((topCard.gasto_total || 0) / (topCard.limite || 1)) * 100).toFixed(1)}% do
                limite utilizado
              </p>
            </div>
          </div>
        )}

        {/* Plano mais próximo de conclusão */}
        {closestPlan && (
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Target className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--card-text)]">
                Plano próximo da meta
              </h3>
            </div>
            <div>
              <p className="text-lg font-bold text-[var(--card-text)]">
                {closestPlan.nome}
              </p>
              <p className="text-sm text-[var(--card-text)]/70 mt-1">
                Progresso:{" "}
                <span className="font-semibold text-green-500">
                  {(closestPlan.progresso || 0).toFixed(1)}%
                </span>
              </p>
              <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(closestPlan.progresso || 0, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-[var(--card-text)]/60 mt-2">
                {(closestPlan.total_contribuido || 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}{" "}
                de{" "}
                {(closestPlan.meta || 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
