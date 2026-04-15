import { useState, useMemo } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import TransactionList from '../components/TransactionList';
import { Search, BarChart3 } from 'lucide-react';
import './Transactions.css';

type Filter = 'all' | 'income' | 'expense';

export default function TransactionsPage() {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = transactions;
    if (filter !== 'all') {
      list = list.filter((t) => t.type === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [transactions, filter, search]);

  return (
    <div className="transactions-page">
      <div className="txn-filters">
        {(['all', 'income', 'expense'] as Filter[]).map((f) => (
          <button
            key={f}
            className={`txn-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <input
          className="txn-search"
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <TransactionList transactions={filtered} />
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <BarChart3 size={48} />
          </div>
          <p className="empty-state-text">
            {transactions.length === 0
              ? 'No transactions yet'
              : 'No matching transactions'}
          </p>
        </div>
      )}
    </div>
  );
}
