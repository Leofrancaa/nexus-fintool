"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { CardType } from "@/types/card";
import { EditCardForm } from "../forms/editCardForm";

interface Props {
  card: CardType;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditCardModal({ card, open, onClose, onUpdated }: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Editar Cartão
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                className="text-white hover:text-gray-300 cursor-pointer"
                data-radix-dialog-close
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <EditCardForm card={card} onClose={onClose} onUpdated={onUpdated} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
