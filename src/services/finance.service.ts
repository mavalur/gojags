import type { Transaction, TransactionType, Category, FinanceSummary, CategoryBreakdown } from '../types';

const TXN_KEY = 'team_finance_transactions';

// Curated colors for each category
const CATEGORY_COLORS: Record<Category, string> = {
  contribution: '#6366f1',
  refunds: '#8b5cf6',
  tournament_fee: '#f43f5e',
  tournament_balls: '#fb923c',
  team_expenses_gears: '#22d3ee',
  team_building: '#facc15',
  ground_expenses: '#34d399',
};

function getStoredTransactions(): Transaction[] {
  const raw = localStorage.getItem(TXN_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTransactions(txns: Transaction[]) {
  localStorage.setItem(TXN_KEY, JSON.stringify(txns));
}

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

export function addTransaction(
  txn: Omit<Transaction, 'id'>
): Transaction {
  const transactions = getStoredTransactions();
  const newTxn: Transaction = { ...txn, id: generateId() };
  transactions.unshift(newTxn);
  saveTransactions(transactions);
  return newTxn;
}

export function getTransactions(): Transaction[] {
  return getStoredTransactions();
}

export function deleteTransaction(id: string): void {
  const transactions = getStoredTransactions().filter((t) => t.id !== id);
  saveTransactions(transactions);
}

export function updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id'>>): Transaction | undefined {
  const transactions = getStoredTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    saveTransactions(transactions);
    return transactions[index];
  }
}

export function getSummary(transactions: Transaction[]): FinanceSummary {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

export function getCategoryBreakdown(
  transactions: Transaction[],
  type: TransactionType = 'expense'
): CategoryBreakdown[] {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((s, t) => s + t.amount, 0);
  const map = new Map<Category, number>();

  for (const t of filtered) {
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }

  return Array.from(map.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: CATEGORY_COLORS[category] ?? '#94a3b8',
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getCategoryColor(category: Category): string {
  return CATEGORY_COLORS[category];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  contribution: 'Team Expense Contribution',
  refunds: 'Refunds',
  tournament_fee: 'Tournament Fee',
  tournament_balls: 'Tournament Balls',
  team_expenses_gears: 'Team Expenses & Gears',
  team_building: 'Team Building & Meetups',
  ground_expenses: 'Ground Expenses',
};

export const CATEGORIES: { value: Category; label: string; type: TransactionType }[] = [
  { value: 'contribution', label: 'Team Expense Contribution', type: 'income' },
  { value: 'refunds', label: 'Refunds', type: 'income' },
  { value: 'tournament_fee', label: 'Tournament Fee', type: 'expense' },
  { value: 'tournament_balls', label: 'Tournament Balls', type: 'expense' },
  { value: 'team_expenses_gears', label: 'Team Expenses & Gears', type: 'expense' },
  { value: 'team_building', label: 'Team Building & Meetups', type: 'expense' },
  { value: 'ground_expenses', label: 'Ground Expenses', type: 'expense' },
];
