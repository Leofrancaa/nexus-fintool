"use client";

import { createContext, useContext, useState } from "react";

// Tipagem do contexto
interface DateContextProps {
  selectedYear: number;
  selectedMonth: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
}

// Criar o contexto
const DateContext = createContext<DateContextProps | undefined>(undefined);

// Provedor
interface DateProviderProps {
  children: React.ReactNode;
}

export const DateProvider = ({ children }: DateProviderProps) => {
  const now = new Date();
  const [selectedYear, setYear] = useState(now.getFullYear());
  const [selectedMonth, setMonth] = useState(now.getMonth());

  return (
    <DateContext.Provider
      value={{
        selectedYear,
        selectedMonth,
        setYear,
        setMonth,
      }}
    >
      {children}
    </DateContext.Provider>
  );
};

// Hook personalizado
export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate deve ser usado dentro de um <DateProvider>");
  }
  return context;
};
