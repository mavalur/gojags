import { useState, type FormEvent } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import '../components/EditTransactionModal.css';

interface Props {
  onClose: () => void;
}

export default function AddTournamentModal({ onClose }: Props) {
  const { addTournament } = useSchedule();
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addTournament(name);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-txn-page" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Tournament</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="add-txn-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tournament Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Summer Cup 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn edit-submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
