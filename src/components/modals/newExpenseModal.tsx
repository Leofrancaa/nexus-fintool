"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { NewExpenseForm } from "../forms/newExpenseForm";
import AddButton from "../ui/addButton";

export function NewExpenseModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <AddButton variant="primary" className="h-10">
          Nova Despesa
        </AddButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

        {/* ⬇️ Content: flex col + min-h-0 + altura limitada à viewport */}
        <Dialog.Content
          className="
            fixed z-50
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[92vw] sm:w-[90vw] max-w-2xl
            rounded-2xl
            bg-[var(--background)] text-[var(--foreground)]
            border border-[color:var(--card-border)] shadow-lg
            focus:outline-none
            flex flex-col min-h-0
            max-h-[90dvh] sm:max-h-[92dvh]
          "
        >
          {/* Header (não encolhe) */}
          <div className="flex items-center justify-between gap-4 p-4 pb-3 border-b border-[color:var(--card-border)] shrink-0">
            <Dialog.Title className="text-lg font-semibold">
              Nova Despesa
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                className="
                  p-2 rounded-lg
                  border border-[color:var(--card-border)]
                  bg-[var(--card-icon-bg-neutral)]
                  text-[var(--card-icon)]
                  hover:bg-[var(--hover-bg)]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--foreground)]
                "
                data-radix-dialog-close
                aria-label="Fechar"
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          {/* Área ROLÁVEL (o form fica aqui dentro) */}
          <div
            className="
              flex-1 min-h-0
              overflow-y-auto overscroll-contain
              px-4 py-4
              pr-2 -mr-2   /* evita empurrão lateral pela barra de rolagem */
            "
            style={{ WebkitOverflowScrolling: "touch" }} /* iOS suave */
          >
            <NewExpenseForm
              onClose={() => setOpen(false)}
              onCreated={onCreated}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
