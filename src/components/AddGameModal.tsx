import { useState, type FormEvent } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import '../components/EditTransactionModal.css';

interface Props {
  onClose: () => void;
}

export default function AddGameModal({ onClose }: Props) {
  const { addGame, tournaments } = useSchedule();
  
  const [type, setType] = useState<'game' | 'practice'>('game');
  const [tournamentId, setTournamentId] = useState('');
  const [opponent, setOpponent] = useState('');
  const [location, setLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!location || !startDateTime) return;
    
    addGame({
      type,
      tournamentId: type === 'game' && tournamentId ? tournamentId : undefined,
      opponent: type === 'game' ? opponent : '',
      location,
      startDateTime,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-txn-page" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Schedule {type === 'game' ? 'Game' : 'Practice'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="add-txn-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-toggle-btn income ${type === 'game' ? 'active' : ''}`}
                onClick={() => setType('game')}
              >
                Game
              </button>
              <button
                type="button"
                className={`type-toggle-btn expense ${type === 'practice' ? 'active' : ''}`}
                onClick={() => setType('practice')}
              >
                Practice
              </button>
            </div>
          </div>

          {type === 'game' && (
            <>
              <div className="form-group">
                <label className="form-label">Tournament (Optional)</label>
                <select
                  className="form-select"
                  value={tournamentId}
                  onChange={(e) => setTournamentId(e.target.value)}
                >
                  <option value="">-- None (Ad-hoc) --</option>
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Opponent Team</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Tigers"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  required={type === 'game'}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Field C"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Start Date & Time</label>
            <input
              className="form-input"
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn edit-submit">
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
