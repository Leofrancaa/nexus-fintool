"use client";

import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/auth";
import { Heart, RefreshCw } from "lucide-react";

interface Criterio {
  pontos: number;
  descricao: string;
}

interface HealthScoreData {
  score: number;
  nivel: "Excelente" | "Bom" | "Regular" | "Atenção";
  criterios: Record<string, Criterio>;
}

interface HealthScoreCardProps {
  refreshKey?: number;
}

const NIVEL_CONFIG = {
  Excelente: { color: "#22c55e", bg: "bg-green-500/10", text: "text-green-400" },
  Bom: { color: "#60a5fa", bg: "bg-blue-500/10", text: "text-blue-400" },
  Regular: { color: "#f59e0b", bg: "bg-yellow-500/10", text: "text-yellow-400" },
  Atenção: { color: "#ef4444", bg: "bg-red-500/10", text: "text-red-400" },
};

export function HealthScoreCard({ refreshKey }: HealthScoreCardProps) {
  const [data, setData] = useState<HealthScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchScore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/api/dashboard/health-score");
      const json = await res.json();
      if (res.ok) setData(json.data);
    } catch {
      // silently fail — non-critical widget
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScore();
  }, [fetchScore, refreshKey]);

  const config = data ? NIVEL_CONFIG[data.nivel] : null;

  return (
    <div className="rounded-xl border bg-[var(--card-bg)] border-[var(--card-border)] p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-[#00D4D4]" />
          <span className="font-semibold text-[var(--card-text)] text-sm">Saúde Financeira</span>
        </div>
        <button
          onClick={fetchScore}
          disabled={loading}
          className="text-[var(--card-text)]/50 hover:text-[var(--card-text)] transition-colors disabled:animate-spin"
          title="Atualizar"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-6 h-6 border-2 border-[#00D4D4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data && config ? (
        <>
          {/* Score circle + level */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-[var(--card-border)]"
                />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  strokeWidth="3"
                  stroke={config.color}
                  strokeDasharray={`${data.score} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--card-text)]">
                {data.score}
              </span>
            </div>
            <div>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.text}`}>
                {data.nivel}
              </span>
              <p className="text-xs text-[var(--card-text)]/60 mt-1">de 100 pontos</p>
            </div>
          </div>

          {/* Criteria breakdown */}
          <div className="space-y-2">
            {Object.entries(data.criterios).map(([key, criterio]) => (
              <div key={key} className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${criterio.pontos > 0 ? "bg-green-500" : "bg-red-400"}`}
                />
                <span className="text-[var(--card-text)]/80 flex-1 min-w-0 truncate">
                  {criterio.descricao}
                </span>
                <span className={`font-semibold shrink-0 ${criterio.pontos > 0 ? "text-green-400" : "text-red-400"}`}>
                  +{criterio.pontos}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-xs text-[var(--card-text)]/50 text-center py-4">
          Não foi possível carregar o score.
        </p>
      )}
    </div>
  );
}
