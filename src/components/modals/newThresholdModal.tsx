"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { NewThresholdForm } from "../forms/newThresholdForm";
import AddButton from "@/components/ui/addButton";
import { Threshold } from "@/types/threshold";

interface NewThresholdModalProps {
  onCreated?: (limite: Threshold) => void;
}

export function NewThresholdModal({ onCreated }: NewThresholdModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <AddButton variant="primary" className="h-10">
          Novo Limite
        </AddButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Novo Limite
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

          <NewThresholdForm
            onClose={() => {
              const closeBtn = document.querySelector(
                "[data-radix-dialog-close]"
              ) as HTMLButtonElement;
              closeBtn?.click();
            }}
            onCreated={onCreated}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
