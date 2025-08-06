"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { MONTHS } from "@/utils/constants";

interface InvestmentFiltersProps {
  onSearchChange: (term: string) => void;
  onAssetChange: (key: string) => void;
  onCustomMonthChange?: (mes: string) => void;
  onCustomYearChange?: (ano: string) => void;
  ativos: { key: string; nome: string }[];
  selectedAsset: string;
}

export function InvestmentFilters({
  onSearchChange,
  onAssetChange,
  onCustomMonthChange,
  onCustomYearChange,
  ativos,
  selectedAsset,
}: InvestmentFiltersProps) {
  const [search, setSearch] = useState("");

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearchChange(e.target.value);
  };

  return (
    <div
      className="w-full flex flex-col md:flex-row gap-4 rounded-xl p-4 items-center justify-between"
      style={{
        backgroundColor: "var(--filter-bg)",
        border: "1px solid var(--filter-border)",
      }}
    >
      {/* Busca */}
      <div className="relative w-full md:w-[60%]">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--filter-placeholder)] w-5 h-5"
          aria-hidden="true"
        />
        <Input
          variant="dark"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar investimentos…"
          className="pl-10 text-[var(--filter-text)] placeholder:text-[var(--filter-placeholder)] bg-[var(--filter-input-bg)] border border-[var(--filter-input-border)] rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Ativo */}
      <div className="w-full md:w-[20%]">
        <Select value={selectedAsset} onValueChange={onAssetChange}>
          <SelectTrigger
            className="w-full bg-[var(--filter-input-bg)] border border-[var(--filter-input-border)] text-[var(--filter-text)] rounded-xl"
            aria-label="Selecionar ativo"
          >
            <SelectValue placeholder="Todos os ativos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os ativos</SelectItem>
            {ativos.map((a) => (
              <SelectItem key={a.key} value={a.key}>
                {a.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mês e Ano */}
      <div className="flex gap-4 w-full md:w-auto">
        {/* Mês */}
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

        {/* Ano */}
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
    </div>
  );
}
