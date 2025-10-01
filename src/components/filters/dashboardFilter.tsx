// =======================================================
// NOVO ARQUIVO: src/components/filters/dashboardFilter.tsx
// =======================================================

"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { MONTHS } from "@/utils/constants";

interface DashboardFilterProps {
  onCustomMonthChange?: (mes: string) => void;
  onCustomYearChange?: (ano: string) => void;
}

export function DashboardFilter({
  onCustomMonthChange,
  onCustomYearChange,
}: DashboardFilterProps) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    String(now.getMonth() + 1)
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    String(now.getFullYear())
  );

  useEffect(() => {
    onCustomMonthChange?.(selectedMonth);
  }, [selectedMonth, onCustomMonthChange]);

  useEffect(() => {
    onCustomYearChange?.(selectedYear);
  }, [selectedYear, onCustomYearChange]);

  return (
    <div className="w-full h-full flex flex-col gap-3 bg-[var(--filter-bg)] border border-[var(--filter-border)] rounded-xl p-4 justify-between">
      {/* Ícone e Título + Botão Mês Atual */}
      <div className="flex items-center justify-between text-[var(--filter-text)] font-medium">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--filter-placeholder)]" />
          <span>Período</span>
        </div>
        <button
          onClick={() => {
            const currentMonth = String(new Date().getMonth() + 1);
            const currentYear = String(new Date().getFullYear());
            setSelectedMonth(currentMonth);
            setSelectedYear(currentYear);
          }}
          className="text-xs text-[var(--filter-placeholder)] hover:text-[var(--filter-text)] transition-colors duration-200"
        >
          Mês Atual
        </button>
      </div>

      {/* Filtros de Mês e Ano */}
      <div className="flex gap-3 w-full">
        {/* MÊS */}
        <Select
          value={selectedMonth}
          onValueChange={(mes) => setSelectedMonth(mes)}
        >
          <SelectTrigger className="flex-1 bg-[var(--filter-input-bg)] border border-[var(--filter-input-border)] text-[var(--filter-text)] rounded-xl">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((mes, index) => (
              <SelectItem key={index} value={String(index + 1)}>
                {mes}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ANO */}
        <Select
          value={selectedYear}
          onValueChange={(ano) => setSelectedYear(ano)}
        >
          <SelectTrigger className="flex-1 bg-[var(--filter-input-bg)] border border-[var(--filter-input-border)] text-[var(--filter-text)] rounded-xl">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {[2023, 2024, 2025, 2026].map((ano) => (
              <SelectItem key={ano} value={String(ano)}>
                {ano}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
