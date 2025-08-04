"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "react-hot-toast";

interface MarketItem {
  nome: string;
  preco: number | null;
  variacao: number | null;
  moeda: string;
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
    const interval = setInterval(fetchData, 1000 * 60 * 5);
    return () => clearInterval(interval);
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

  if (loading)
    return <div className="text-sm text-white/60">Carregando mercado...</div>;

  return (
    <aside
      className="w-full lg:max-w-[40%] flex-shrink-0"
      role="region"
      aria-label="Painel do mercado financeiro"
    >
      <div className="bg-[#0D0D0D] border border-[#222] rounded-xl p-4">
        <h2 className="text-lg font-semibold text-white mb-4">
          Panorama do Mercado
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[540px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent hover:scrollbar-thumb-[#555]">
          {Object.entries(data).map(([key, item]) => {
            const precoFormatado = formatValor(item.preco, item.moeda);
            const variacaoFormatada =
              item.variacao !== null ? `${item.variacao.toFixed(2)}%` : null;

            const icon =
              item.variacao !== null ? (
                item.variacao >= 0 ? (
                  <TrendingUp className="text-green-400" />
                ) : (
                  <TrendingDown className="text-red-400" />
                )
              ) : null;

            const bgColor =
              item.variacao === null
                ? "bg-gray-800"
                : item.variacao >= 0
                ? "bg-green-900/30"
                : "bg-red-900/30";

            return (
              <div
                key={key}
                className="flex items-center gap-4 bg-[#18181b] rounded-xl p-4 border border-[#262626]"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${bgColor}`}
                >
                  {icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    {item.nome}
                  </span>
                  <span className="text-xl font-bold text-white">
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
