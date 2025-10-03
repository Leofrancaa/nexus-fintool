"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  placeholder?: string;
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function DatePicker({ value, onChange, placeholder = "Selecione uma data" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Inicializar displayMonth baseado no valor selecionado
  useEffect(() => {
    if (value) {
      const [year, month] = value.split('-').map(Number);
      setDisplayMonth(new Date(year, month - 1));
    }
  }, [value]);

  const handleDateClick = (day: number) => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1));
  };

  const getDaysInMonth = () => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];

    // Adicionar dias vazios no início
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Adicionar dias do mês
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return placeholder;
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const isSelectedDate = (day: number) => {
    if (!value) return false;
    const [year, month, selectedDay] = value.split('-').map(Number);
    return (
      day === selectedDay &&
      displayMonth.getMonth() === month - 1 &&
      displayMonth.getFullYear() === year
    );
  };

  const isToday = (day: number) => {
    // Criar data no timezone local para evitar problemas
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return (
      day === today.getDate() &&
      displayMonth.getMonth() === today.getMonth() &&
      displayMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--card-text)] text-left flex items-center justify-between hover:border-[var(--card-border)]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <span className={value ? "text-[var(--card-text)]" : "text-[var(--card-text)]/50"}>
          {formatDisplayDate(value)}
        </span>
        <Calendar className="w-5 h-5 text-[var(--card-text)]/70" />
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full sm:min-w-[320px] p-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl left-0 right-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--card-text)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h3 className="text-base font-semibold text-[var(--card-text)]">
              {MESES[displayMonth.getMonth()]} {displayMonth.getFullYear()}
            </h3>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--card-text)] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DIAS_SEMANA.map((dia) => (
              <div
                key={dia}
                className="text-center text-xs font-medium text-[var(--card-text)]/60 py-2"
              >
                {dia}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const selected = isSelectedDate(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all
                    ${selected
                      ? 'bg-gradient-to-r from-[#2256FF] via-[#00D4AA] to-[#00D4D4] text-white shadow-lg'
                      : today
                        ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'
                        : 'text-[var(--card-text)] hover:bg-[var(--hover-bg)]'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer com atalho "Hoje" */}
          <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
            <button
              type="button"
              onClick={() => {
                // Criar data no timezone local
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                onChange(dateStr);
                setIsOpen(false);
              }}
              className="w-full py-2 rounded-lg text-sm font-medium text-[var(--card-text)] hover:bg-[var(--hover-bg)] transition-colors"
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
