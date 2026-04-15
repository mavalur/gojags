import { useState, type FormEvent } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES } from '../services/finance.service';
import type { TransactionType, Category } from '../types';
import './AddTransaction.css';

export default function AddTransactionPage() {
  const { addTransaction } = useFinance();
  const { currentUser } = useAuth();
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('tournament_fee');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [success, setSuccess] = useState(false);

  const availableCategories = CATEGORIES.filter(
    (c) => c.type === type
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    addTransaction({
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
      createdBy: currentUser?.id ?? '',
    });

    // Reset
    setAmount('');
    setDescription('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Reset category when type changes
  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    const first = CATEGORIES.find((c) => c.type === t);
    if (first) setCategory(first.value);
  };

  return (
    <div className="add-txn-page">
      {success && (
        <div className="success-msg">✅ Transaction added successfully!</div>
      )}

      <form className="add-txn-form" onSubmit={handleSubmit}>
        {/* Type Toggle */}
        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-toggle">
            <button
              type="button"
              className={`type-toggle-btn income ${type === 'income' ? 'active' : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              ↑ Income
            </button>
            <button
              type="button"
              className={`type-toggle-btn expense ${type === 'expense' ? 'active' : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              ↓ Expense
            </button>
          </div>
        </div>

        {/* Amount & Date */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount ($)</label>
            <input
              id="txn-amount"
              className="form-input"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              id="txn-date"
              className="form-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            id="txn-category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {availableCategories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            id="txn-description"
            className="form-input"
            type="text"
            placeholder="e.g. Lunch with team"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </form>
    </div>
  );
}
