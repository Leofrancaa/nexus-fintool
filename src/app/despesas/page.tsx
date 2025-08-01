"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import PageTitle from "@/components/pageTitle";
import { NewExpenseModal } from "@/components/modals/newExpenseModal";
import { ExpenseList } from "@/components/lists/expenseList";
import { ExpenseFilters } from "../../components/expenseFilter";
import { ExpenseStatsCards } from "../../components/expenseStatsCard";

export default function Expenses() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [customMonth, setCustomMonth] = useState("");
  const [customYear, setCustomYear] = useState("");

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
    <main className="flex flex-col min-h-screen bg-black px-8 py-4">
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

      <ExpenseStatsCards customMonth={customMonth} customYear={customYear} />

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 mt-6">
        <ExpenseFilters
          categorias={categorias}
          onSearchChange={(term) => setSearchTerm(term)}
          onCategoryChange={(id) => setSelectedCategory(id)}
          onCustomMonthChange={(mes) => setCustomMonth(mes)}
          onCustomYearChange={(ano) => setCustomYear(ano)}
          selectedCategory={selectedCategory}
        />
      </div>

      <ExpenseList
        refreshKey={refreshKey}
        searchTerm={searchTerm}
        categoryId={selectedCategory}
        period="custom"
        customMonth={customMonth}
        customYear={customYear}
      />
    </main>
  );
}
