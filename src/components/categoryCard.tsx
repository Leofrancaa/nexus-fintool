"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import DeleteButton from "@/components/ui/deleteButton";
import ConfirmDialog from "@/components/ui/confirmDialog";
import { Categoria } from "@/types/category";

interface CategoryCardProps {
  id: number;
  nome: string;
  cor: string;
  tipo: "despesa" | "receita";
  subcategorias: Categoria[];
  onDelete: (id: number) => void;
}

export default function CategoryCard({
  id,
  nome,
  cor,
  tipo,
  subcategorias,
  onDelete,
}: CategoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<number | null>(null);

  const handleDelete = async (categoryId: number) => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Erro ao excluir categoria");
      toast.success("Categoria excluída com sucesso!");
      onDelete(categoryId);
    } catch {
      toast.error("Erro ao excluir categoria");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 border border-white/10 rounded-lg p-4 bg-[#1B1B1B] shadow-md text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: cor }}
          />
          <div>
            <p className="font-semibold">{nome}</p>
            <p className="text-sm text-gray-400 capitalize">{tipo}</p>
          </div>
        </div>

        <DeleteButton
          onClick={() => setConfirmOpen(true)}
          disabled={isDeleting}
        />
      </div>

      {subcategorias.length > 0 && (
        <div className="ml-8 mt-2 flex flex-col gap-1">
          {subcategorias.map((sub) => (
            <div
              key={sub.id}
              className="flex justify-between items-center border border-white/5 rounded-md p-2 bg-[#111]"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: sub.cor }}
                />
                <p className="text-sm">{sub.nome}</p>
              </div>
              <DeleteButton
                onClick={() => setSubToDelete(sub.id)}
                disabled={isDeleting}
              />
            </div>
          ))}
        </div>
      )}

      {/* Dialog de confirmação para categoria pai */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deseja excluir a categoria?"
        description="Todas as subcategorias também serão removidas."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => handleDelete(id)}
      />

      {/* Dialog de confirmação para subcategoria */}
      <ConfirmDialog
        open={subToDelete !== null}
        onOpenChange={(open) => !open && setSubToDelete(null)}
        title="Deseja excluir a subcategoria?"
        description="Essa ação não poderá ser desfeita."
        onCancel={() => setSubToDelete(null)}
        onConfirm={() => {
          if (subToDelete !== null) {
            handleDelete(subToDelete);
            setSubToDelete(null);
          }
        }}
      />
    </div>
  );
}
