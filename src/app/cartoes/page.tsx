"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/pageTitle";
import { NewCardModal } from "@/components/modals/newCardModal";
import { EditCardModal } from "@/components/modals/editCardModal"; // 👈 importar o modal
import { CardVisual } from "@/components/cardVisual";
import { CardType } from "@/types/card";
import { toast } from "react-hot-toast";

export default function Cards() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [editando, setEditando] = useState<CardType | null>(null); // 👈 controle do modal

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

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <main className="flex flex-col min-h-screen bg-black px-8 py-4">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-12 lg:mt-0">
        <PageTitle
          title="Cartões"
          subTitle="Gerencie e acompanhe seus cartões"
        />
        <NewCardModal onCreated={fetchCards} />
      </div>

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CardVisual
            key={card.id}
            card={card}
            onEdit={() => setEditando(card)} // abre o modal
          />
        ))}
      </section>

      {editando && (
        <EditCardModal
          card={editando} // ✅ aqui o editando já nunca será null
          open={!!editando}
          onClose={() => setEditando(null)}
          onUpdated={() => {
            fetchCards();
            setEditando(null);
          }}
        />
      )}
    </main>
  );
}
