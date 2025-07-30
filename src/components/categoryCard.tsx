"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import DeleteButton from "@/components/ui/deleteButton";
import ConfirmDialog from "@/components/ui/confirmDialog";

interface CategoryCardProps {
  id: number;
  nome: string;
  cor: string;
  tipo: "despesa" | "receita";
  onDelete: (id: number) => void;
}

export default function CategoryCard({
  id,
  nome,
  cor,
  tipo,
  onDelete,
}: CategoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao excluir categoria");

      toast.success("Categoria excluída com sucesso!");
      onDelete(id);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir categoria");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center border border-white/10 rounded-lg p-4 bg-[#1B1B1B] shadow-md text-white">
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
          onClick={() => setShowConfirm(true)}
          disabled={isDeleting}
        />
      </div>

      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Deseja excluir a categoria?"
        description="Essa ação não poderá ser desfeita."
      />
    </>
  );
}
