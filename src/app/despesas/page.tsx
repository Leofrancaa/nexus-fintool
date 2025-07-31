"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageTitle from "@/components/pageTitle";
import { NewExpenseModal } from "@/components/modals/newExpenseModal";

export default function Expenses() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <main className="flex flex-col min-h-screen bg-black px-8 py-4">
      {/* Título + Filtros + Botão Nova Despesa */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-12 lg:mt-0">
        <PageTitle
          title="Despesas"
          subTitle="Gerencie e acompanhe seus gastos"
        />

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <NewExpenseModal
            onCreated={() => {
              // TODO: Recarregar despesas
            }}
          />
        </div>
      </div>

      {/* Lista de despesas aqui futuramente */}
      <div className="mt-10">
        {/* Exemplo: <ExpenseList /> ou cards */}
        <p className="text-gray-500 text-sm">
          Nenhuma despesa carregada. Você pode adicionar uma nova acima.
        </p>
      </div>
    </main>
  );
}
