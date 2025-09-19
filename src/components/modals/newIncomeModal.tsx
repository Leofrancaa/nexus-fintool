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
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

        {/* ⬇️ mantém o MESMO estilo; só acrescentei flex + min-h-0 */}
        <Dialog.Content
          className="
            fixed z-50 max-h-[100dvh]
            top-1/2 left-1/2 w-[90vw] max-w-2xl
            -translate-x-1/2 -translate-y-1/2
            rounded-2xl bg-[#111] border border-[#333]
            p-6 shadow-lg focus:outline-none
            flex flex-col min-h-0
          "
        >
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Nova Receita
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                className="text-white hover:text-gray-300 cursor-pointer"
                data-radix-dialog-close
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          {/* ⬇️ wrapper rolável (apenas estrutura, sem mudar visual) */}
          <div
            className="
              flex-1 min-h-0
              overflow-y-auto overscroll-contain
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
