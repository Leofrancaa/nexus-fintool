// src/components/panels/expenseByCategoryPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/auth";

interface CategoriaResumo {
  nome: string;
  cor: string;
  total: number;
  quantidade: number;
  percentual: number;
}

interface Props {
  mes: number;
  ano: number;
  refreshKey: number;
}

export function ExpensesByCategoryPanel({ mes, ano, refreshKey }: Props) {
  const [dados, setDados] = useState<CategoriaResumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mes || !ano || isNaN(mes) || isNaN(ano)) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await apiRequest(
          `/api/expenses/category-resume?mes=${mes}&ano=${ano}`
        );

        if (!res.ok) {
          throw new Error(`Erro na API: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        console.log("Dados recebidos do API category-resume:", json);

        // Processar os dados com tratamento defensivo
        const rawData = json.data || json || [];
        const processedData = rawData.map((item: CategoriaResumo) => ({
          nome: item.nome || "Sem nome",
          cor: item.cor || "#22d3ee",
          total: Number(item.total || 0),
          quantidade: Number(item.quantidade || 0),
          percentual: Number(item.percentual || 0),
        }));

        console.log("Dados processados:", processedData);
        setDados(processedData);
      } catch (error) {
        console.error("Erro ao carregar resumo de categorias:", error);
        setDados([]); // Garantir que dados seja um array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mes, ano, refreshKey]);

  if (loading) {
    return (
      <div className="bg-[var(--list-bg)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-sm text-[var(--card-text)]">
        <p className="text-sm text-muted-foreground">
          Carregando categorias...
        </p>
      </div>
    );
  }

  if (!dados || dados.length === 0) {
    return (
      <div className="bg-[var(--list-bg)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-sm text-[var(--card-text)]">
        <p className="text-sm text-muted-foreground">
          Nenhuma categoria encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--list-bg)] border border-[var(--card-border)] rounded-2xl p-6 w-full lg:max-w-sm 3xl:max-w-xl text-[var(--card-text)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--card-text)]">
          Gastos por Categoria
        </h2>
        <p className="text-md text-muted-foreground">
          Distribuição dos seus gastos
        </p>
      </div>

      <div className="space-y-4">
        {dados.map((item, i) => {
          // Tratamento defensivo para cada item
          const nome = item?.nome || "Categoria sem nome";
          const cor = item?.cor || "#22d3ee";
          const total = Number(item?.total || 0);
          const quantidade = Number(item?.quantidade || 0);
          const percentual = Number(item?.percentual || 0);

          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: cor }}
                  />
                  <span className="text-lg font-semibold">{nome}</span>
                </div>
                <span className="text-cyan-500 font-bold text-lg mt-1">
                  {total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-md">{percentual.toFixed(1)}%</span>
                <span className="bg-emerald-500 text-black text-sm font-bold px-2 py-0.5 rounded-full">
                  {quantidade}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
