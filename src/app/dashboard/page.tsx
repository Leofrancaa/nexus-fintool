// src/app/dashboard/page.tsx
"use client";

import { useState } from "react";
import PageTitle from "@/components/pageTitle";
import { DashboardCards } from "@/components/cards/dashboardStatsCard";
import { DashboardFilter } from "@/components/filters/dashboardFilter";
import { NewExpenseModal } from "@/components/modals/newExpenseModal";
import { NewIncomeModal } from "@/components/modals/newIncomeModal";
import BalanceChart from "@/components/charts/balanceChart";
import { ExpenseByCategoryChart } from "../../components/charts/expenseByCategoryChart";
import { IncomeByCategoryPieChart } from "../../components/charts/incomeByCategoryPieChart";

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Estados para controlar mês/ano personalizados
  const [customMonth, setCustomMonth] = useState<string>(
    String(new Date().getMonth() + 1)
  );
  const [customYear, setCustomYear] = useState<string>(
    String(new Date().getFullYear())
  );

  // Handlers para mudança de mês/ano
  const handleMonthChange = (mes: string) => {
    setCustomMonth(mes);
  };

  const handleYearChange = (ano: string) => {
    setCustomYear(ano);
  };
  return (
    <main className="flex flex-col min-h-screen bg-[var(--page-bg)] px-8 py-8 w-full lg:py-4">
      <div className="flex flex-col lg:flex-row w-full items-start justify-between gap-4 mt-14 lg:mt-0">
        <PageTitle
          title="Dashboard"
          subTitle="Gerencie e acompanhe suas finanças"
        />

        <div className="flex flex-col gap-4 lg:flex-row justify-between lg:gap-4 w-full lg:w-auto">
          <NewIncomeModal onCreated={() => setRefreshKey((prev) => prev + 1)} />
          <NewExpenseModal
            onCreated={() => setRefreshKey((prev) => prev + 1)}
          />
        </div>
      </div>

      {/* Filtro de Mês/Ano */}
      <div className="mt-6">
        <DashboardFilter
          onCustomMonthChange={handleMonthChange}
          onCustomYearChange={handleYearChange}
        />
      </div>

      {/* Cards de Estatísticas com mês/ano personalizados */}
      <DashboardCards
        customMonth={customMonth}
        customYear={customYear}
        refreshKey={refreshKey}
      />

      {/* Gráfico de Balanço Mensal */}
      <div className="mt-10 w-full">
        <BalanceChart refreshKey={refreshKey} />
      </div>

      {/* Gráficos por Categoria com mês/ano personalizados */}
      <div className="mt-10 w-full flex flex-col lg:flex-row justify-between gap-4">
        <ExpenseByCategoryChart
          mes={Number(customMonth)}
          ano={Number(customYear)}
          refreshKey={refreshKey}
        />

        <IncomeByCategoryPieChart
          mes={Number(customMonth)}
          ano={Number(customYear)}
          refreshKey={refreshKey}
        />
      </div>
    </main>
  );
}
