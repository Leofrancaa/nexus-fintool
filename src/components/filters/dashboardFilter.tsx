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
    <div className="w-full flex flex-col md:flex-row gap-4 bg-[var(--filter-bg)] border border-[var(--filter-border)] rounded-xl p-4 items-center justify-center">
      {/* Ícone e Título */}
      <div className="flex items-center gap-2 text-[var(--filter-text)] font-medium">
        <Calendar className="w-5 h-5 text-[var(--filter-placeholder)]" />
        <span>Período:</span>
      </div>

      {/* Filtros de Mês e Ano */}
      <div className="flex gap-4 w-full md:w-auto">
        {/* MÊS */}
        <Select
          value={selectedMonth}
          onValueChange={(mes) => setSelectedMonth(mes)}
        >
          <SelectTrigger className="w-full md:w-[160px] bg-[var(--filter-input-bg)] border border-[var(--filter-input-border)] text-[var(--filter-text)] rounded-xl">
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
          <SelectTrigger className="w-full md:w-[120px] bg-[var(--filter-input-bg)] border border-[var(--filter-input-border)] text-[var(--filter-text)] rounded-xl">
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

      {/* Botão para voltar ao mês atual */}
      <button
        onClick={() => {
          const currentMonth = String(new Date().getMonth() + 1);
          const currentYear = String(new Date().getFullYear());
          setSelectedMonth(currentMonth);
          setSelectedYear(currentYear);
        }}
        className="text-sm text-[var(--filter-placeholder)] hover:text-[var(--filter-text)] transition-colors duration-200 whitespace-nowrap"
      >
        Mês Atual
      </button>
    </div>
  );
}
