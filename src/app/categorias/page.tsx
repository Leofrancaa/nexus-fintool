"use client";

import { useEffect, useState, useCallback } from "react";
import PageTitle from "@/components/pageTitle";
import { NewCategoryModal } from "@/components/modals/newCategoryModal";
import CategoryCard from "@/components/cards/categoryCard";
import { Categoria } from "@/types/category";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { apiRequest, isAuthenticated } from "@/lib/auth";

export default function Categories() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
  }, [router]);

  const fetchCategorias = useCallback(async () => {
    try {
      const res = await apiRequest("/api/categories");

      if (!res.ok) throw new Error("Erro ao buscar categorias");

      const data: Categoria[] = await res.json();
      setCategorias(data);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Sessão expirada")) {
        router.push("/login");
      } else {
        toast.error("Erro ao buscar categorias");
      }
    }
  }, [router]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const categoriasPai = categorias.filter((cat) => cat.parent_id === null);
  const getSubcategorias = (id: number) =>
    categorias.filter((cat) => cat.parent_id === id);

  return (
    <main
      className="flex flex-col min-h-screen px-8 py-8 lg:py-4"
      style={{ background: "var(--page-bg)" }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-14 lg:mt-0">
        <PageTitle
          title="Categorias"
          subTitle="Gerencie e acompanhe suas categorias"
        />
        <NewCategoryModal
          onCreated={(novaCategoria) =>
            setCategorias((prev) => [novaCategoria, ...prev])
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {categoriasPai.map((categoria) => (
          <CategoryCard
            key={categoria.id}
            id={categoria.id}
            nome={categoria.nome}
            cor={categoria.cor}
            tipo={categoria.tipo}
            subcategorias={getSubcategorias(categoria.id)}
            onDelete={(deletedId) =>
              setCategorias((prev) =>
                prev.filter((cat) => cat.id !== deletedId)
              )
            }
          />
        ))}
      </div>
    </main>
  );
}
