"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import PageTitle from "@/components/pageTitle";
import { NewInvestmentModal } from "@/components/modals/newInvestmentModal";
import { InvestmentList } from "@/components/lists/investmentList";
import { InvestmentFilters } from "@/components/filters/investmentFilter";
import { InvestmentStatsCards } from "@/components/cards/investmentStatsCard";
import { InvestmentPanel } from "@/components/panels/investmentPanel"; // agora funcionando como painel lateral

export default function Investments() {
  const router = useRouter();
  const now = new Date();

  const [customMonth, setCustomMonth] = useState(String(now.getMonth() + 1));
  const [customYear, setCustomYear] = useState(String(now.getFullYear()));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("todos");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const ativos = [
    { key: "dolar", nome: "Dólar" },
    { key: "euro", nome: "Euro" },
    { key: "bitcoin", nome: "Bitcoin" },
    { key: "ethereum", nome: "Ethereum" },
    { key: "solana", nome: "Solana" },
    { key: "selic", nome: "Selic" },
    { key: "ibovespa", nome: "Ibovespa" },
    { key: "bradesco", nome: "Bradesco" },
    { key: "petrobras", nome: "Petrobras" },
    { key: "vale", nome: "Vale" },
  ];

  // Memoized handlers
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleAssetChange = useCallback((id: string) => {
    setSelectedAsset(id);
  }, []);

  const handleMonthChange = useCallback((mes: string) => {
    setCustomMonth(mes);
  }, []);

  const handleYearChange = useCallback((ano: string) => {
    setCustomYear(ano);
  }, []);

  // Auth
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

  if (loading) return null;

  return (
    <main className="flex flex-col min-h-screen bg-[#0f0f0f] px-8 py-4">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-12 lg:mt-0">
        <PageTitle
          title="Investimentos"
          subTitle="Gerencie e acompanhe seus investimentos"
        />

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <NewInvestmentModal
            onCreated={() => setRefreshKey((prev) => prev + 1)}
          />
        </div>
      </div>

      {/* Cards de estatísticas */}
      <InvestmentStatsCards
        refreshKey={refreshKey}
        customMonth={customMonth}
        customYear={customYear}
        assetKey={selectedAsset}
      />

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 mt-6">
        <InvestmentFilters
          ativos={ativos}
          selectedAsset={selectedAsset}
          onSearchChange={handleSearchChange}
          onAssetChange={handleAssetChange}
          onCustomMonthChange={handleMonthChange}
          onCustomYearChange={handleYearChange}
        />
      </div>

      {/* Lista + Painel lateral */}
      <div className="flex flex-col lg:flex-row gap-4">
        <InvestmentList
          refreshKey={refreshKey}
          searchTerm={searchTerm}
          assetKey={selectedAsset}
          customMonth={customMonth}
          customYear={customYear}
        />

        {/* Painel com dados do mercado (lado direito) */}
        <InvestmentPanel />
      </div>
    </main>
  );
}
