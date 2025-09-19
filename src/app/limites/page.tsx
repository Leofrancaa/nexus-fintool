"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/pageTitle";
import { NewThresholdModal } from "@/components/modals/newThresholdModal";
import ThresholdCard from "@/components/cards/thresholdCard";
import { Threshold } from "@/types/threshold";
import { toast } from "react-hot-toast";
import { EditThresholdModal } from "@/components/modals/editThresholdModal";
import { useRouter } from "next/navigation";

const fetchGastoPorCategoria = async (categoryId: number): Promise<number> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/total-by-category/${categoryId}`,
      { credentials: "include" }
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.total || 0;
  } catch {
    return 0;
  }
};

export default function Limits() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const [limites, setLimites] = useState<Threshold[]>([]);
  const [gastos, setGastos] = useState<Record<number, number>>({});
  const [editando, setEditando] = useState<Threshold | null>(null);

  const carregarLimites = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/thresholds`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error();

      const data: Threshold[] = await res.json();
      setLimites(data);

      const gastosTemp: Record<number, number> = {};
      for (const lim of data) {
        gastosTemp[lim.category_id] = await fetchGastoPorCategoria(
          lim.category_id
        );
      }
      setGastos(gastosTemp);
    } catch {
      toast.error("Erro ao carregar limites");
    }
  };

  useEffect(() => {
    carregarLimites();
  }, []);

  return (
    <main
      className="flex flex-col min-h-screen px-8 py-8 lg:py-4"
      style={{ background: "var(--page-bg)" }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-14 lg:mt-0">
        <PageTitle
          title="Limites"
          subTitle="Gerencie e acompanhe seus limites"
        />
        <NewThresholdModal onCreated={carregarLimites} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {limites.map((limite) =>
          limite.categoria ? (
            <ThresholdCard
              key={limite.id}
              threshold={limite}
              gastoAtual={gastos[limite.category_id] || 0}
              onEdit={(limite) => setEditando(limite)}
            />
          ) : (
            <div
              key={limite.id}
              className="p-4 rounded-lg text-sm shadow-md"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--card-text)",
              }}
            >
              Limite sem categoria vinculada
            </div>
          )
        )}
      </div>

      {editando && (
        <EditThresholdModal
          threshold={editando}
          onClose={() => setEditando(null)}
          onUpdated={carregarLimites}
        />
      )}
    </main>
  );
}
