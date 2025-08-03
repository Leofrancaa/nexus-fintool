"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import PageTitle from "@/components/pageTitle";
import { NewExpenseModal } from "@/components/modals/newExpenseModal";
import { ExpenseList } from "@/components/lists/expenseList";
import { ExpenseFilters } from "@/components/expenseFilter";
import { ExpenseStatsCards } from "@/components/expenseStatsCard";
import { ExpensesByCategoryPanel } from "@/components/expenseByCategoryPanel";

export default function Expenses() {
  const router = useRouter();
  // Estados
  const now = new Date();
  const [customMonth, setCustomMonth] = useState(String(now.getMonth() + 1)); // mês atual
  const [customYear, setCustomYear] = useState(String(now.getFullYear())); // ano atual

  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Memoize handlers para evitar rerender do useEffect nos filhos
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

  // Verificação de autenticação
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

  // Carregar categorias
  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      setCategorias(data);
    };

    fetchCategorias();
  }, []);

  if (loading) return null;

  return (
    <main className="flex flex-col min-h-screen bg-[#0f0f0f] px-8 py-4">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-12 lg:mt-0">
        <PageTitle
          title="Despesas"
          subTitle="Gerencie e acompanhe seus gastos"
        />

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <NewExpenseModal
            onCreated={() => setRefreshKey((prev) => prev + 1)}
          />
        </div>
      </div>

      {/* Cards de estatísticas */}
      <ExpenseStatsCards
        refreshKey={refreshKey}
        customMonth={customMonth}
        customYear={customYear}
        categoryId={selectedCategory}
      />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 mt-6">
        <ExpenseFilters
          categorias={categorias}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onCustomMonthChange={handleMonthChange}
          onCustomYearChange={handleYearChange}
          selectedCategory={selectedCategory}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Lista de despesas */}
        <ExpenseList
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          searchTerm={searchTerm}
          categoryId={selectedCategory}
          period="custom"
          customMonth={customMonth}
          customYear={customYear}
        />

        {customMonth && customYear && (
          <ExpensesByCategoryPanel
            mes={parseInt(customMonth)}
            ano={parseInt(customYear)}
            refreshKey={refreshKey} // ✅ passa aqui
          />
        )}
      </div>
    </main>
  );
}
