// src/types/balanceCarryover.ts

export interface CarryoverStatus {
  source_mes: number
  source_ano: number
  saldo: number
  tipo: 'positivo' | 'negativo' | 'zerado'
  status: 'pendente' | 'aplicado' | 'sem_saldo'
  income_id?: number
  expense_id?: number
}

export interface CarryoverHistoryItem {
  mes: number
  ano: number
  saldo: number
  tipo: 'positivo' | 'negativo'
  applied_at: string
}
