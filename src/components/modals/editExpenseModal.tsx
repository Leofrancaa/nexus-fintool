"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { EditExpenseForm } from "../forms/editExpenseForm";
import { Expense } from "@/types/expense";

interface Props {
  expense: Expense | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditExpenseModal({ expense, onClose, onUpdated }: Props) {
  if (!expense) return null;

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold text-white">
              Editar Despesa
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="text-white" />
            </button>
          </div>
          <EditExpenseForm
            expense={expense}
            onClose={onClose}
            onUpdated={onUpdated}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
