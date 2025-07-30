"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/pageTitle";
import { NewCategoryModal } from "@/components/modals/newCategoryModal";
import CategoryCard from "@/components/categoryCard";
import { Categoria } from "@/types/category";
import { toast } from "react-hot-toast";

export default function Categories() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao buscar categorias");

      const data: Categoria[] = await res.json();
      setCategorias(data);
    } catch {
      toast.error("Erro ao buscar categorias");
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const categoriasPai = categorias.filter((cat) => cat.parent_id === null);
  const getSubcategorias = (id: number) =>
    categorias.filter((cat) => cat.parent_id === id);

  return (
    <main className="flex flex-col min-h-screen bg-black px-8 py-4">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-12 lg:mt-0">
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
