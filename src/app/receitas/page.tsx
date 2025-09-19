"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import PageTitle from "@/components/pageTitle";
import { NewIncomeModal } from "@/components/modals/newIncomeModal";
import { IncomeFilters } from "@/components/filters/incomeFilter";
import { IncomeList } from "@/components/lists/incomeList";
import { IncomeStatsCards } from "@/components/cards/incomesStatsCard";
import { IncomesByCategoryPanel } from "@/components/panels/incomeByCategoryPanel";
import { apiRequest, isAuthenticated } from "@/lib/auth";
import { toast } from "react-hot-toast";

export default function Incomes() {
  const router = useRouter();
  const now = new Date();

  const [customMonth, setCustomMonth] = useState(String(now.getMonth() + 1));
  const [customYear, setCustomYear] = useState(String(now.getFullYear()));
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Handlers memorizados
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleCategoryChange = useCallback((id: string) => {
    setSelectedCategory(id);
  }, []);

  const handleMonthChange = useCallback((mes: string) => {
    setCustomMonth(mes);
  }, []);

  const handleYearChange = useCallback((ano: string) => {
    setCustomYear(ano);
  }, []);

  // Autenticação
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, [router]);

  // Carregar categorias (só receitas)
  const fetchCategorias = useCallback(async () => {
    try {
      const res = await apiRequest("/api/categories?tipo=receita");
      if (!res.ok) throw new Error("Erro ao buscar categorias");
      const data = await res.json();
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
    if (!loading) {
      fetchCategorias();
    }
  }, [loading, fetchCategorias]);

  if (loading) return null;

  return (
    <main className="flex flex-col min-h-screen bg-[var(--page-bg)] px-8 py-8 lg:py-4">
      {/* Cabeçalho */}

      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-14 lg:mt-0">
        <PageTitle
          title="Receitas"
          subTitle="Gerencie e acompanhe suas receitas"
        />
        <NewIncomeModal onCreated={() => setRefreshKey((prev) => prev + 1)} />
      </div>

      {/* Cards */}
      <IncomeStatsCards
        refreshKey={refreshKey}
        customMonth={customMonth}
        customYear={customYear}
        categoryId={selectedCategory}
      />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 mt-6">
        <IncomeFilters
          categorias={categorias}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onCustomMonthChange={handleMonthChange}
          onCustomYearChange={handleYearChange}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Lista + Painel lateral */}
      <div className="flex flex-col lg:flex-row gap-4">
        <IncomeList
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          searchTerm={searchTerm}
          categoryId={selectedCategory}
          period="custom"
          customMonth={customMonth}
          customYear={customYear}
        />

        {customMonth && customYear && (
          <IncomesByCategoryPanel
            mes={parseInt(customMonth)}
            ano={parseInt(customYear)}
            refreshKey={refreshKey}
          />
        )}
      </div>
    </main>
  );
}
