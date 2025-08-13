"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/pageTitle";
import { NewCardModal } from "@/components/modals/newCardModal";
import { EditCardModal } from "@/components/modals/editCardModal";
import { CardVisual } from "@/components/cards/cardVisual";
import { CardType } from "@/types/card";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Cards() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [editando, setEditando] = useState<CardType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  // auth guard
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        credentials: "include",
      });
      if (!res.ok) router.push("/login");
    };
    checkAuth();
  }, [router]);

  const fetchCards = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data: CardType[] = await res.json();
      setCards(data);
    } catch {
      toast.error("Erro ao buscar cartões");
    }
  };

  // refetch quando refreshKey mudar
  useEffect(() => {
    fetchCards();
  }, [refreshKey]);

  // handlers de refresh
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <main
      className="flex flex-col min-h-screen px-8 py-8 lg:py-4"
      style={{ background: "var(--page-bg)" }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-14 lg:mt-0">
        <PageTitle
          title="Cartões"
          subTitle="Gerencie e acompanhe seus cartões"
        />
        <NewCardModal onCreated={handleRefresh} />
      </div>

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CardVisual
            key={card.id}
            card={card}
            onEdit={() => setEditando(card)}
            onDelete={(cardId: number) => {
              setCards((prev) => prev.filter((c) => c.id !== cardId));
              handleRefresh(); // garante sync com backend
            }}
            onRefresh={handleRefresh} // pagar fatura/editar etc.
          />
        ))}
      </section>

      {editando && (
        <EditCardModal
          card={editando}
          open={!!editando}
          onClose={() => setEditando(null)}
          onUpdated={() => {
            handleRefresh();
            setEditando(null);
          }}
        />
      )}
    </main>
  );
}
