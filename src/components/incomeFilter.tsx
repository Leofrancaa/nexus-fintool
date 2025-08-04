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

interface IncomeFiltersProps {
  onSearchChange: (term: string) => void;
  onCategoryChange: (id: string) => void;
  onCustomMonthChange?: (mes: string) => void;
  onCustomYearChange?: (ano: string) => void;
  categorias: { id: number; nome: string }[];
  selectedCategory: string;
}

export function IncomeFilters({
  onSearchChange,
  onCategoryChange,
  onCustomMonthChange,
  onCustomYearChange,
  categorias,
  selectedCategory,
}: IncomeFiltersProps) {
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
    <div className="w-full flex flex-col md:flex-row gap-4 bg-[#111] border border-[#222] rounded-xl p-4 items-center justify-between">
      {/* Linha 1: Busca */}
      <div className="relative w-full md:w-[60%]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          variant="dark"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar receitas…"
          className="pl-10 text-white placeholder:text-muted-foreground bg-[#0D0D0D] border border-[#333] rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Linha 2: Categoria */}
      <div className="w-full md:w-[20%]">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full bg-[#0D0D0D] border border-[#333] text-white rounded-xl">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Linha 3: Mês e Ano */}
      <div className="flex gap-4 w-full md:w-auto">
        {/* Mês */}
        <Select
          value={selectedMonth}
          onValueChange={(mes) => setSelectedMonth(mes)}
        >
          <SelectTrigger className="w-full md:w-[160px] bg-[#0D0D0D] border border-[#333] text-white rounded-xl">
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
          <SelectTrigger className="w-full md:w-[120px] bg-[#0D0D0D] border border-[#333] text-white rounded-xl">
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
