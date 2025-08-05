"use client";

import { useEffect, useState } from "react";

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
  refreshKey: number; // ✅ NOVO
}

export function ExpensesByCategoryPanel({ mes, ano, refreshKey }: Props) {
  const [dados, setDados] = useState<CategoriaResumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mes || !ano || isNaN(mes) || isNaN(ano)) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/resumo-categorias?mes=${mes}&ano=${ano}`,
          { credentials: "include" }
        );
        const json = await res.json();
        setDados(json);
      } catch (error) {
        console.error("Erro ao carregar resumo de categorias", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mes, ano, refreshKey]); // ✅ adiciona refreshKey aqui também

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 w-full max-w-sm text-white">
        <p className="text-sm text-muted-foreground">
          Carregando categorias...
        </p>
      </div>
    );
  }

  if (dados.length === 0) {
    return (
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 w-full max-w-sm text-white">
        <p className="text-sm text-muted-foreground">
          Nenhuma categoria encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 w-full lg:max-w-sm 3xl:max-w-xl text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#00D4D4]">
          Gastos por Categoria
        </h2>
        <p className="text-md text-muted-foreground">
          Distribuição dos seus gastos
        </p>
      </div>

      <div className="space-y-4">
        {dados.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: item.cor || "#22d3ee" }}
                />
                <span className="text-lg font-semibold">{item.nome}</span>
              </div>
              <span className="text-cyan-400 font-bold text-lg mt-1">
                {item.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-md text-white">
                {item.percentual.toFixed(1)}%
              </span>
              <span className="bg-emerald-500 text-black text-sm font-bold px-2 py-0.5 rounded-full">
                {item.quantidade}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
