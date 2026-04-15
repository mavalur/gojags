import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Transaction, FinanceSummary, CategoryBreakdown } from '../types';
import * as financeService from '../services/finance.service';

interface FinanceContextValue {
  transactions: Transaction[];
  summary: FinanceSummary;
  expenseBreakdown: CategoryBreakdown[];
  incomeBreakdown: CategoryBreakdown[];
  addTransaction: (txn: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  refresh: () => void;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refresh = useCallback(() => {
    setTransactions(financeService.getTransactions());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTransaction = useCallback(
    (txn: Omit<Transaction, 'id'>) => {
      financeService.addTransaction(txn);
      refresh();
    },
    [refresh]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      financeService.deleteTransaction(id);
      refresh();
    },
    [refresh]
  );

  const updateTransaction = useCallback(
    (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
      financeService.updateTransaction(id, updates);
      refresh();
    },
    [refresh]
  );

  const summary = financeService.getSummary(transactions);
  const expenseBreakdown = financeService.getCategoryBreakdown(transactions, 'expense');
  const incomeBreakdown = financeService.getCategoryBreakdown(transactions, 'income');

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        summary,
        expenseBreakdown,
        incomeBreakdown,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refresh,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used inside <FinanceProvider>');
  return ctx;
}
