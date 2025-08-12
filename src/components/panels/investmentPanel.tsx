"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { toast } from "react-hot-toast";

interface MarketItem {
  nome: string;
  preco: number | null;
  variacao: number | null; // pode vir null (ex.: SELIC)
  moeda: string; // "BRL", "USD", "%", etc.
  erro?: boolean;
}

interface MarketData {
  [key: string]: MarketItem;
}

export function InvestmentPanel() {
  const [data, setData] = useState<MarketData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/finance/market`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Erro ao buscar dados do mercado.");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar dados do mercado.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatValor = (valor: number | null, moeda: string) => {
    if (valor === null) return "-";
    if (moeda === "%") return `${valor.toFixed(2)}%`;
    try {
      return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: moeda || "BRL",
      });
    } catch {
      return valor.toFixed(2);
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-[var(--card-text)]/60">
        Carregando mercado...
      </div>
    );
  }

  return (
    <aside
      className="w-full lg:max-w-[40%] flex-shrink-0"
      role="region"
      aria-label="Painel do mercado financeiro"
      style={{ backgroundColor: "var(--page-bg)" }}
    >
      <div
        className="rounded-xl p-4 border"
        style={{
          backgroundColor: "var(--list-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4 text-[var(--card-text)]">
          Panorama do Mercado
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[540px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#333] hover:scrollbar-thumb-[#555]">
          {Object.entries(data).map(([key, item]) => {
            const precoFormatado = formatValor(item.preco, item.moeda);
            const variacaoFormatada =
              item.variacao !== null ? `${item.variacao.toFixed(2)}%` : null;

            // ícone sempre presente (Minus quando variacao === null)
            const IconComp =
              item.variacao === null
                ? Minus
                : item.variacao >= 0
                ? TrendingUp
                : TrendingDown;

            // fundo do ícone via variáveis (sem classes bg-*)
            const iconBg =
              item.variacao === null
                ? "var(--card-icon-bg-neutral)"
                : item.variacao >= 0
                ? "var(--card-icon-bg-green)"
                : "var(--card-icon-bg-red)";

            return (
              <div
                key={key}
                className="flex items-center gap-4 rounded-xl p-4 border"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: iconBg, color: "var(--card-icon)" }}
                  aria-hidden="true"
                >
                  <IconComp />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    {item.nome}
                  </span>
                  <span className="text-xl font-bold text-[var(--card-text)]">
                    {precoFormatado}
                  </span>
                  {variacaoFormatada && (
                    <span className="text-xs text-muted-foreground">
                      {variacaoFormatada}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
