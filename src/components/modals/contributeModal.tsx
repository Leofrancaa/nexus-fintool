"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { ContributeForm } from "../forms/contributeForm";

interface Props {
  planId: number;
  onContributed?: () => void;
}

export function ContributeModal({ planId, onContributed }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 text-black bg-cyan-400 hover:bg-cyan-300 px-4 py-2 rounded-xl font-medium text-sm transition-all">
          Contribuir
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Contribuir com o plano
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

          <ContributeForm
            planId={planId}
            onClose={() => setOpen(false)}
            onContributed={onContributed}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
