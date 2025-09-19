"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import DeleteButton from "@/components/ui/deleteButton";
import ConfirmDialog from "@/components/ui/confirmDialog";
import { Categoria } from "@/types/category";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/auth";

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
  const [stats, setStats] = useState({
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
        const res = await apiRequest(
          `/api/${
            tipo === "receita" ? "incomes" : "expenses"
          }/resumo-categorias?mes=${
            now.getMonth() + 1
          }&ano=${now.getFullYear()}`
        );
        if (!res.ok) throw new Error("Erro ao buscar estatísticas");
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
        if (
          error instanceof Error &&
          error.message.includes("Sessão expirada")
        ) {
          router.push("/login");
        }
      }
    };

    fetchStats();
  }, [nome, tipo, router]);

  const handleDelete = async (categoryId: number) => {
    try {
      setIsDeleting(true);
      const res = await apiRequest(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir categoria");
      toast.success("Categoria excluída com sucesso!");
      onDelete(categoryId);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Sessão expirada")) {
        router.push("/login");
      } else {
        toast.error("Erro ao excluir categoria");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 border rounded-lg p-5 shadow-md"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
        color: "var(--card-text)",
      }}
    >
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
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {tipo}
            </p>
          </div>
        </div>

        <DeleteButton
          onClick={() => setConfirmOpen(true)}
          disabled={isDeleting}
        />
      </div>

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
          <span className="text-cyan-600 font-bold text-base">
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

      <div className="flex justify-between mt-3 items-center flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          {subcategorias.map((sub) => (
            <span
              key={sub.id}
              className="text-xs px-3 py-1 rounded-full border"
              style={{
                color: cor,
                borderColor: cor,
                backgroundColor: "var(--card-list-bg)",
              }}
            >
              {sub.nome}
            </span>
          ))}
        </div>
        <button
          onClick={() =>
            router.push(tipo === "receita" ? "/receitas" : "/despesas")
          }
          className="text-sm px-4 py-2 rounded-md border hover:bg-white/10 transition cursor-pointer"
          style={{
            borderColor: "var(--card-border)",
            color: "var(--card-text)",
          }}
        >
          {tipo === "receita" ? "Ver Receitas" : "Ver Despesas"}
        </button>
      </div>

      {/* Confirmações */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deseja excluir a categoria?"
        description="Todas as subcategorias também serão removidas."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => handleDelete(id)}
      />
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
