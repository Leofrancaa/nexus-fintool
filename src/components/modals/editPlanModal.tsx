"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { EditPlanForm } from "../forms/editPlanForm";

interface Plano {
  id: number;
  nome: string;
  descricao?: string;
  meta: number;
  prazo: string;
}

interface EditPlanModalProps {
  plano: Plano | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditPlanModal({
  plano,
  onClose,
  onUpdated,
}: EditPlanModalProps) {
  if (!plano) return null;

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#111] border border-[#333] p-6 shadow-lg focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              Editar Plano
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                className="text-white hover:text-gray-300 cursor-pointer"
                data-radix-dialog-close
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <EditPlanForm plano={plano} onClose={onClose} onUpdated={onUpdated} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
