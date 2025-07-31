"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/pageTitle";
import { NewCardModal } from "@/components/modals/newCardModal";
import { CardVisual } from "@/components//cardVisual";
import { CardType } from "@/types/card";
import { toast } from "react-hot-toast";

export default function Cards() {
  const [cards, setCards] = useState<CardType[]>([]);

  const fetchCards = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards`, {
        credentials: "include", // ✅ cookies HTTP-only
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
        <NewCardModal
          onCreated={() => {
            fetchCards();
          }}
        />
      </div>

      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CardVisual
            key={card.id}
            card={card}
            onEdit={(editedCard) => {
              // Implement your edit logic here, e.g., open an edit modal or update state
              // For now, just show a toast as a placeholder
              toast.success(`Editar cartão: ${editedCard.id}`);
            }}
          />
        ))}
      </section>
    </main>
  );
}
