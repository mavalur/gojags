import { useState } from 'react';
import type { Transaction, Category } from '../types';
import { useFinance } from '../contexts/FinanceContext';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORY_LABELS } from '../services/finance.service';
import { Trash2, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import EditTransactionModal from './EditTransactionModal';
import './TransactionList.css';

interface Props {
  transactions: Transaction[];
  compact?: boolean;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TransactionList({ transactions, compact }: Props) {
  const { deleteTransaction } = useFinance();
  const { currentUser } = useAuth();
  const isEditor = currentUser?.role === 'editor';
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  if (transactions.length === 0) return null;

  return (
    <div className="txn-list">
      {transactions.map((t) => (
        <div className="txn-item" key={t.id}>
          <div className={`txn-icon ${t.type}`}>
            {t.type === 'income' ? (
              <TrendingUp size={18} />
            ) : (
              <TrendingDown size={18} />
            )}
          </div>

          <div className="txn-details">
            <div className="txn-desc">{t.description}</div>
            <div className="txn-meta">
              <span>{formatDate(t.date)}</span>
              <span className="txn-category-badge">
                {CATEGORY_LABELS[t.category as Category] ?? t.category}
              </span>
            </div>
          </div>

          <div className={`txn-amount ${t.type}`}>
            {t.type === 'income' ? '+' : '-'}
            {formatCurrency(t.amount)}
          </div>

          {isEditor && !compact && (
            <div className="txn-actions">
              <button
                className="txn-edit"
                onClick={() => setEditingTransaction(t)}
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                className="txn-delete"
                onClick={() => deleteTransaction(t.id)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      ))}
      
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
}
