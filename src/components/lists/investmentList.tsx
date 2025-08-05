"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Investment {
  id: number;
  descricao: string;
  ativo: string; // chave do ativo: "bitcoin", "dolar", etc.
  quantidade: number;
  valor_investido: number;
  data: string;
  observacoes?: string;
}

interface MarketItem {
  preco: number;
  moeda: string;
}

interface Props {
  refreshKey: number;
  searchTerm: string;
  assetKey: string;
  customMonth?: string;
  customYear?: string;
}

export function InvestmentList({
  refreshKey,
  searchTerm,
  assetKey,
  customMonth,
  customYear,
}: Props) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [marketData, setMarketData] = useState<Record<string, MarketItem>>({});

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/finance/market`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMarketData(data);
      } catch {
        toast.error("Erro ao buscar valores atuais dos ativos.");
      }
    };

    const fetchInvestments = async () => {
      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_API_URL}/api/investments`
        );
        if (assetKey && assetKey !== "todos")
          url.searchParams.set("asset", assetKey);
        if (customMonth) url.searchParams.set("month", customMonth);
        if (customYear) url.searchParams.set("year", customYear);

        const res = await fetch(url.toString(), {
          credentials: "include",
        });

        const data = await res.json();
        let filtrado = data as Investment[];

        if (searchTerm.trim() !== "") {
          filtrado = filtrado.filter((i) =>
            i.descricao.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setInvestments(filtrado);
      } catch (error) {
        console.error("Erro ao carregar investimentos:", error);
        setInvestments([]);
      }
    };

    fetchMarketData();
    fetchInvestments();
  }, [refreshKey, searchTerm, assetKey, customMonth, customYear]);

  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 w-full lg:max-w-[60%] text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#00D4D4]">
          Investimentos Simulados
        </h2>
        <p className="text-base text-muted-foreground">
          Simulações realizadas com base nos valores de mercado
        </p>
      </div>

      <div className="space-y-5">
        {investments.length > 0 ? (
          investments.map((inv) => {
            const ativo = marketData[inv.ativo];
            const valorAtual = ativo?.preco
              ? ativo.preco * inv.quantidade
              : null;
            const rendimento =
              valorAtual !== null ? valorAtual - inv.valor_investido : null;

            return (
              <div
                key={inv.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl bg-[#111] border border-[#222] p-5 hover:border-[#00D4D4] transition-all"
              >
                <div className="flex flex-col flex-1 break-words">
                  <p className="text-lg font-bold text-white">
                    {inv.descricao}
                  </p>

                  <div className="text-sm lg:text-md text-muted-foreground mt-2 flex flex-wrap gap-2 items-center">
                    <span className="text-white font-medium">
                      {inv.ativo.toUpperCase()}
                    </span>
                    <span>•</span>
                    <span className="text-white font-medium">
                      {new Date(inv.data).toLocaleDateString("pt-BR")}
                    </span>
                    {inv.observacoes && (
                      <>
                        <span>•</span>
                        <span className="text-muted-foreground truncate max-w-[180px]">
                          Obs: {inv.observacoes}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end items-start gap-1">
                  <p className="text-md text-muted-foreground">
                    Investido:{" "}
                    <span className="text-white font-medium">
                      {inv.valor_investido.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </p>
                  <p className="text-md text-muted-foreground">
                    Valor Atual:{" "}
                    <span className="text-white font-medium">
                      {valorAtual !== null
                        ? valorAtual.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : "N/D"}
                    </span>
                  </p>
                  <p
                    className={`text-md font-bold ${
                      rendimento && rendimento >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {rendimento !== null
                      ? `${rendimento >= 0 ? "+" : "-"}${Math.abs(
                          rendimento
                        ).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}`
                      : "Rendimento: N/D"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-base text-muted-foreground mt-2">
            Nenhum investimento encontrado para o filtro atual.
          </p>
        )}
      </div>
    </div>
  );
}
