"use client";

import { useEffect, useState } from "react";
import EditButton from "../ui/editButton";
import DeleteButton from "../ui/deleteButton";

interface Expense {
  id: number;
  tipo: string;
  quantidade: number;
  metodo_pagamento: string;
  data: string;
  categoria_nome?: string;
  cor_categoria?: string;
  category_id?: number;
}

interface ExpenseListProps {
  refreshKey: number;
  searchTerm: string;
  categoryId: string;
  period: string;
  customMonth?: string;
  customYear?: string;
}

export function ExpenseList({
  refreshKey,
  searchTerm,
  categoryId,
  period,
  customMonth,
  customYear,
}: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[] | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        let startDate = "";
        let endDate = "";

        const pad = (n: number) => String(n).padStart(2, "0");

        if (period === "custom" && customMonth && customYear) {
          const mes = parseInt(customMonth);
          const ano = parseInt(customYear);
          startDate = `${ano}-${pad(mes)}-01`;
          endDate = new Date(ano, mes, 0).toISOString().split("T")[0];
        } else {
          const now = new Date();
          const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

          switch (period) {
            case "mes_passado":
              startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
                .toISOString()
                .split("T")[0];
              endDate = new Date(now.getFullYear(), now.getMonth(), 0)
                .toISOString()
                .split("T")[0];
              break;
            case "ultimos_3_meses":
              startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
                .toISOString()
                .split("T")[0];
              endDate = lastDay.toISOString().split("T")[0];
              break;
            case "ano_atual":
              startDate = `${now.getFullYear()}-01-01`;
              endDate = `${now.getFullYear()}-12-31`;
              break;
            case "mes_atual":
            default:
              startDate = firstDay.toISOString().split("T")[0];
              endDate = lastDay.toISOString().split("T")[0];
          }
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/expenses?start_date=${startDate}&end_date=${endDate}`,
          { credentials: "include" }
        );

        const data = await res.json();
        let filtrado = data as Expense[];

        if (categoryId !== "todas") {
          filtrado = filtrado.filter(
            (e) => String(e.category_id) === categoryId
          );
        }

        if (searchTerm.trim() !== "") {
          filtrado = filtrado.filter((e) =>
            e.tipo.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setExpenses(filtrado);
      } catch (error) {
        console.error("Erro ao carregar despesas:", error);
        setExpenses([]);
      }
    };

    fetchExpenses();
  }, [refreshKey, searchTerm, categoryId, period, customMonth, customYear]);

  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-6 w-full max-w-5xl text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#00D4D4]">Despesas Recentes</h2>
        <p className="text-base text-muted-foreground">
          Últimas movimentações registradas
        </p>
      </div>

      <div className="space-y-5">
        {expenses && expenses.length > 0 ? (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl bg-[#111] border border-[#222] p-5 hover:border-[#00D4D4] transition-all"
            >
              {/* Detalhes */}
              <div className="flex flex-col flex-1 break-words">
                <p className="text-lg font-bold text-white">{expense.tipo}</p>
                <div className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-2 items-center">
                  {expense.categoria_nome ? (
                    <span className="font-medium text-white">
                      {expense.categoria_nome}
                    </span>
                  ) : (
                    <span className="text-red-400">Sem categoria</span>
                  )}
                  <span>•</span>
                  <span className="text-white font-medium">
                    {expense.metodo_pagamento}
                  </span>
                  <span>•</span>
                  <span className="text-white font-medium">
                    {new Date(expense.data).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between sm:justify-end items-center gap-4 w-full sm:w-auto">
                {/* Valor */}
                <p className="text-cyan-400 font-bold text-lg whitespace-nowrap">
                  -
                  {expense.quantidade.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

                {/* Botões */}
                <div className="flex gap-2">
                  <EditButton
                    onClick={() => console.log("Editar", expense.id)}
                  />
                  <DeleteButton
                    onClick={() => console.log("Excluir", expense.id)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-base text-muted-foreground mt-2">
            Nenhuma despesa encontrada para o filtro atual.
          </p>
        )}
      </div>
    </div>
  );
}
