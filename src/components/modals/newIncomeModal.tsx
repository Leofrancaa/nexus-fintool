"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { NewIncomeForm } from "../forms/newIncomeForm";
import AddButton from "../ui/addButton";

export function NewIncomeModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <AddButton variant="primary" className="h-10">
          Nova Receita
        </AddButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />

        {/* Content com layout para scroll interno */}
        <Dialog.Content
          className="
            fixed z-50
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[92vw] sm:w-[90vw] max-w-2xl
            rounded-2xl
            text-[var(--foreground)]
            border border-[color:var(--card-border)] shadow-lg
            focus:outline-none
            flex flex-col min-h-0
            max-h-[90dvh] sm:max-h-[92dvh]
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 p-4 pb-3 border-b border-[color:var(--card-border)] shrink-0">
            <Dialog.Title className="text-lg font-semibold">
              Nova Receita
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
                aria-label="Fechar"
                data-radix-dialog-close
              >
                ✕
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
            <NewIncomeForm
              onClose={() => setOpen(false)}
              onCreated={onCreated}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
