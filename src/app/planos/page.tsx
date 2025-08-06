"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/pageTitle";
import { NewPlanModal } from "@/components/modals/newPlanModal";
import PlanCard from "@/components/cards/planCard";

interface Plano {
  id: number;
  nome: string;
  meta: number;
  prazo: string;
  descricao?: string;
  total_contribuido: number;
}

export default function Plans() {
  const router = useRouter();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        credentials: "include",
      });
      if (!res.ok) router.push("/login");
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchPlanos = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans`, {
        credentials: "include",
      });
      const data = await res.json();
      setPlanos(data);
    };

    fetchPlanos();
  }, [refreshKey]);

  return (
    <main
      className="flex flex-col min-h-screen px-8 py-4"
      style={{ background: "var(--page-bg)" }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-12 lg:mt-0">
        <PageTitle title="Planos" subTitle="Gerencie e acompanhe seus planos" />
        <NewPlanModal onCreated={() => setRefreshKey((k) => k + 1)} />
      </div>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planos.length === 0 ? (
          <p className="text-[var(--card-text)]/60">Nenhum plano cadastrado.</p>
        ) : (
          planos.map((plano) => (
            <PlanCard
              key={plano.id}
              plano={plano}
              onRefresh={() => setRefreshKey((k) => k + 1)}
            />
          ))
        )}
      </section>
    </main>
  );
}
