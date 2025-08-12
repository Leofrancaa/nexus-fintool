"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/pageTitle";
import { DashboardCards } from "@/components/cards/dashboardStatsCard";
import { NewExpenseModal } from "@/components/modals/newExpenseModal";
import { NewIncomeModal } from "@/components/modals/newIncomeModal";
import BalanceChart from "@/components/charts/balanceChart";
import { ExpenseByCategoryChart } from "../../components/charts/expenseByCategoryChart";
import { IncomeByCategoryPieChart } from "../../components/charts/incomeByCategoryPieChart";

export default function Dashboard() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const currentMonth = String(new Date().getMonth() + 1);
  const currentYear = String(new Date().getFullYear());

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="flex flex-col min-h-screen bg-[var(--page-bg)] px-8 py-4 w-full">
      <div className="flex flex-col lg:flex-row w-full items-start justify-between gap-4 mt-14 lg:mt-0">
        <PageTitle
          title="Dashboard"
          subTitle="Gerencie e acompanhe suas finanças"
        />

        <div className="flex justify-between lg:gap-4 w-full lg:w-auto">
          <NewIncomeModal onCreated={() => setRefreshKey((prev) => prev + 1)} />
          <NewExpenseModal
            onCreated={() => setRefreshKey((prev) => prev + 1)}
          />
        </div>
      </div>

      <DashboardCards
        customMonth={currentMonth}
        customYear={currentYear}
        refreshKey={refreshKey}
      />

      {/* ✅ Gráfico de Balanço Mensal */}
      <div className="mt-10 w-full">
        <BalanceChart />
      </div>

      <div className="mt-10 w-full flex flex-col lg:flex-row justify-between gap-4">
        <ExpenseByCategoryChart
          mes={Number(currentMonth)}
          ano={Number(currentYear)}
          refreshKey={refreshKey}
        />

        <IncomeByCategoryPieChart
          mes={Number(currentMonth)}
          ano={Number(currentYear)}
          refreshKey={refreshKey}
        />
      </div>
    </main>
  );
}
