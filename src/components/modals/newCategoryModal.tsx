// components/modals/NewCategoryModal.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { NewCategoryForm } from "../forms/newCategoryForm";
import AddButton from "@/components/ui/addButton";
import { Categoria } from "@/types/category";

interface NewCategoryModalProps {
  onCreated?: (categoria: Categoria) => void;
}

export function NewCategoryModal({ onCreated }: NewCategoryModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <AddButton variant="primary" className="h-10">
          Nova Categoria
        </AddButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Nova Categoria
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

          <NewCategoryForm
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
