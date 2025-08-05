"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DeleteButton from "@/components/ui/deleteButton";
import ConfirmDialog from "@/components/ui/confirmDialog";
import { Categoria } from "@/types/category";
import { useRouter } from "next/navigation";

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
  const [stats, setStats] = useState<{
    total: number;
    media: number;
    percentual: number;
    quantidade: number;
  }>({
    total: 0,
    media: 0,
    percentual: 0,
    quantidade: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/${
            tipo === "receita" ? "incomes" : "expenses"
          }/resumo-categorias?mes=${
            now.getMonth() + 1
          }&ano=${now.getFullYear()}`,
          { credentials: "include" }
        );
        const data = await res.json();
        const categoria = data.find((c: Categoria) => c.nome === nome);
        if (categoria) {
          setStats({
            total: categoria.total,
            media: categoria.total / categoria.quantidade,
            percentual: categoria.percentual,
            quantidade: categoria.quantidade,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar stats da categoria:", error);
      }
    };

    fetchStats();
  }, [nome, tipo]);

  const handleDelete = async (categoryId: number) => {
    try {
      setIsDeleting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
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
    <div className="flex flex-col gap-4 border border-white/10 rounded-lg p-5 bg-[#1B1B1B] shadow-md text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: cor }}
          />
          <div>
            <p className="text-lg font-bold" style={{ color: cor }}>
              {nome}
            </p>
            <p className="text-sm text-gray-400 capitalize">{tipo}</p>
          </div>
        </div>

        <DeleteButton
          onClick={() => setConfirmOpen(true)}
          disabled={isDeleting}
        />
      </div>

      {/* Estatísticas para despesa ou receita */}
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-md">
              {tipo === "receita" ? "Receitas" : "Despesas"}
            </span>
            <span className="text-lg font-bold text-cyan-400">
              {stats.quantidade}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-md">Do total</span>
            <span className="text-lg font-bold text-purple-500">
              {stats.percentual.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          <span className="text-md">
            {tipo === "receita" ? "Receita total" : "Gasto total"}
          </span>
          <span className="text-cyan-300 font-bold text-base">
            {stats.total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-md">
            {tipo === "receita" ? "Média por receita" : "Média por despesa"}
          </span>
          <span className="text-green-400 font-bold text-base">
            {stats.media.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>

      {/* Subcategorias + botão */}
      <div className="flex justify-between mt-3 items-center flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          {subcategorias.map((sub) => (
            <span
              key={sub.id}
              className="text-xs px-3 py-1 rounded-full border"
              style={{
                color: cor,
                borderColor: cor,
                backgroundColor: "#111",
              }}
            >
              {sub.nome}
            </span>
          ))}
        </div>
        <button
          onClick={() => {
            if (tipo === "receita") {
              router.push("/receitas");
            } else {
              router.push("/despesas");
            }
          }}
          className="text-sm px-4 py-2 rounded-md border border-white/20 hover:bg-white/10 transition cursor-pointer"
        >
          {tipo === "receita" ? "Ver Receitas" : "Ver Despesas"}
        </button>
      </div>

      {/* Confirmação para categoria pai */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deseja excluir a categoria?"
        description="Todas as subcategorias também serão removidas."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => handleDelete(id)}
      />

      {/* Confirmação para subcategoria */}
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
