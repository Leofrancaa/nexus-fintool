"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { NewExpenseForm } from "../forms/newExpenseForm";
import AddButton from "../ui/addButton";

export function NewExpenseModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false); // ✅ estado do modal

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <AddButton variant="primary" className="h-10">
          Nova Despesa
        </AddButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 max-h-[98dvh] top-1/2 left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Nova Despesa
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

          {/* ✅ agora o onClose fecha o modal via setOpen(false) */}
          <NewExpenseForm
            onClose={() => setOpen(false)}
            onCreated={onCreated}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
