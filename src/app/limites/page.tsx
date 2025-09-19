"use client";

import { useEffect, useState, useCallback } from "react";
import PageTitle from "@/components/pageTitle";
import { NewThresholdModal } from "@/components/modals/newThresholdModal";
import ThresholdCard from "@/components/cards/thresholdCard";
import { Threshold } from "@/types/threshold";
import { toast } from "react-hot-toast";
import { EditThresholdModal } from "@/components/modals/editThresholdModal";
import { useRouter } from "next/navigation";
import { apiRequest, isAuthenticated } from "@/lib/auth";

const fetchGastoPorCategoria = async (categoryId: number): Promise<number> => {
  try {
    const res = await apiRequest(
      `/api/expenses/total-by-category/${categoryId}`
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
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
  }, [router]);

  const [limites, setLimites] = useState<Threshold[]>([]);
  const [gastos, setGastos] = useState<Record<number, number>>({});
  const [editando, setEditando] = useState<Threshold | null>(null);

  const carregarLimites = useCallback(async () => {
    try {
      const res = await apiRequest("/api/thresholds");
      if (!res.ok) throw new Error();

      const responseData = await res.json();
      const data: Threshold[] = responseData.data || responseData;
      setLimites(data);

      const gastosTemp: Record<number, number> = {};
      for (const lim of data) {
        gastosTemp[lim.category_id] = await fetchGastoPorCategoria(
          lim.category_id
        );
      }
      setGastos(gastosTemp);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Sessão expirada")) {
        router.push("/login");
      } else {
        toast.error("Erro ao carregar limites");
      }
    }
  }, [router]);

  useEffect(() => {
    carregarLimites();
  }, [carregarLimites]);

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
