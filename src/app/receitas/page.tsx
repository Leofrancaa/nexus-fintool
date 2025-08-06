"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import PageTitle from "@/components/pageTitle";
import { NewIncomeModal } from "@/components/modals/newIncomeModal";
import { IncomeFilters } from "@/components/filters/incomeFilter";
import { IncomeList } from "@/components/lists/incomeList";
import { IncomeStatsCards } from "@/components/cards/incomesStatsCard";
import { IncomesByCategoryPanel } from "@/components/panels/incomeByCategoryPanel";

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
    const checkAuth = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Carregar categorias (só receitas)
  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories?tipo=receita`,
        { credentials: "include" }
      );
      const data = await res.json();
      setCategorias(data);
    };

    fetchCategorias();
  }, []);

  if (loading) return null;

  return (
    <main className="flex flex-col min-h-screen bg-[var(--page-bg)] px-8 py-4">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-12 lg:mt-0">
        <PageTitle
          title="Receitas"
          subTitle="Gerencie e acompanhe suas receitas"
        />

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <NewIncomeModal onCreated={() => setRefreshKey((prev) => prev + 1)} />
        </div>
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
