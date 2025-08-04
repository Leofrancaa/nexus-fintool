"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { NewPlanForm } from "../forms/newPlanForm";
import AddButton from "../ui/addButton";

export function NewPlanModal({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <AddButton variant="primary" className="h-10">
          Novo Plano
        </AddButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Novo Plano
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

          <NewPlanForm onClose={() => setOpen(false)} onCreated={onCreated} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
