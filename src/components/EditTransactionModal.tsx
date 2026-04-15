import { useState, type FormEvent } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { CATEGORIES } from '../services/finance.service';
import type { Transaction, TransactionType, Category } from '../types';
import './EditTransactionModal.css';
import '../pages/AddTransaction.css';

interface Props {
  transaction: Transaction;
  onClose: () => void;
}

export default function EditTransactionModal({ transaction, onClose }: Props) {
  const { updateTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>(transaction.type);
  const [category, setCategory] = useState<Category>(transaction.category);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [description, setDescription] = useState(transaction.description);
  const [date, setDate] = useState(transaction.date);

  const availableCategories = CATEGORIES.filter(
    (c) => c.type === type
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    updateTransaction(transaction.id, {
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
    });

    onClose();
  };

  const handleTypeChange = (t: TransactionType) => {
    setType(t);
    const first = CATEGORIES.find((c) => c.type === t);
    if (first) setCategory(first.value);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-txn-page" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Transaction</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="add-txn-form" onSubmit={handleSubmit}>
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                id="edit-txn-amount"
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
                id="edit-txn-date"
                className="form-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              id="edit-txn-category"
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

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              id="edit-txn-description"
              className="form-input"
              type="text"
              placeholder="e.g. Lunch with team"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn edit-submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
