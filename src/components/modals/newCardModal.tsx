"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useRef } from "react";
import AddButton from "@/components/ui/addButton";
import { NewCardForm } from "../forms/newCardForm";

interface NewCardModalProps {
  onCreated?: () => void;
}

export function NewCardModal({ onCreated }: NewCardModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <AddButton variant="primary" className="h-10">
          Novo Cartão
        </AddButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

        {/* Content com layout correto para scroll interno */}
        <Dialog.Content
          className="
            fixed z-50
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[92vw] sm:w-[90vw] max-w-lg
            rounded-2xl
            bg-[var(--background)] text-[var(--foreground)]
            border border-[color:var(--card-border)] shadow-lg
            focus:outline-none
            flex flex-col min-h-0
            max-h-[90dvh] sm:max-h-[92dvh]
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 p-4 pb-3 border-b border-[color:var(--card-border)] shrink-0">
            <Dialog.Title className="text-lg font-semibold">
              Novo Cartão
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                ref={closeRef}
                className="
                  p-2 rounded-lg
                  border border-[color:var(--card-border)]
                  text-[var(--card-icon)]
                  hover:bg-[var(--hover-bg)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--foreground)]
                "
                aria-label="Fechar"
                data-radix-dialog-close
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Área rolável */}
          <div
            className="
              flex-1 min-h-0
              overflow-y-auto overscroll-contain
              px-4 py-4
              pr-2 -mr-2
            "
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <NewCardForm
              onClose={() => closeRef.current?.click()}
              onCreated={onCreated}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
