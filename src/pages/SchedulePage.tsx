import { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers } from '../services/auth.service';
import type { AvailabilityResponse, User } from '../types';
import AddTournamentModal from '../components/AddTournamentModal';
import AddGameModal from '../components/AddGameModal';
import ViewResponsesModal from '../components/ViewResponsesModal';
import { Trophy, CalendarPlus, MapPin, Calendar, Users as UsersIcon } from 'lucide-react';
import './SchedulePage.css';

export default function SchedulePage() {
  const { games, tournaments, getPollForGame, setAvailability, deleteTournament, deleteGame } = useSchedule();
  const { currentUser } = useAuth();
  const isEditor = currentUser?.role === 'editor';

  const [users] = useState<User[]>(() => getAllUsers());
  const userMap = users.reduce((acc, u) => { acc[u.id] = u.name; return acc; }, {} as Record<string, string>);

  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedVoters, setSelectedVoters] = useState<{available: string[], tentative: string[], unavailable: string[]} | null>(null);

  const getTournamentName = (tId?: string) => {
    if (!tId) return 'Practice / Ad-hoc';
    return tournaments.find(t => t.id === tId)?.name ?? 'Unknown Tournament';
  };

  const handlePoll = (gameId: string, response: AvailabilityResponse) => {
    if (currentUser) {
      setAvailability(gameId, currentUser.id, response);
    }
  };

  return (
    <div className="schedule-page">
      {isEditor && (
        <div className="schedule-actions fade-in">
          <button className="btn-primary" onClick={() => setShowTournamentModal(true)}>
            <Trophy size={18} /> Add Tournament
          </button>
          <button className="btn-secondary" onClick={() => setShowGameModal(true)}>
            <CalendarPlus size={18} /> Schedule Game
          </button>
        </div>
      )}

      {/* Tournaments List summary - basic display */}
      {tournaments.length > 0 && (
        <div className="tournaments-summary">
          <h3>Active Tournaments</h3>
          <div className="tournaments-cards">
            {tournaments.map(t => (
              <div key={t.id} className="tournament-card">
                <div className="t-card-info">
                  <Trophy size={16} />
                  <span>{t.name}</span>
                </div>
                {isEditor && (
                  <button className="t-card-delete" onClick={() => deleteTournament(t.id)}>
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="games-list mt-6">
        {games.length === 0 ? (
          <div className="empty-state">No games or practices scheduled.</div>
        ) : (
          games.map(game => {
            const poll = getPollForGame(game.id);
            const userResponse = currentUser ? poll.responses[currentUser.id] : undefined;
            const voters = { available: [] as string[], tentative: [] as string[], unavailable: [] as string[] };
            
            Object.entries(poll.responses).forEach(([uid, res]) => {
              voters[res].push(userMap[uid] || 'Unknown User');
            });

            return (
              <div key={game.id} className="game-card fade-in">
                <div className="game-header">
                  <div className="game-tournament-badge">
                     {getTournamentName(game.tournamentId)}
                  </div>
                  {isEditor && (
                    <button className="game-delete" onClick={() => deleteGame(game.id)}>
                      Delete
                    </button>
                  )}
                </div>
                
                <div className="game-body">
                  <h3 className="game-title">
                    {game.type === 'practice' ? 'Practice' : `Game vs ${game.opponent}`}
                  </h3>
                  
                  <div className="game-details">
                    <div className="game-detail-item">
                      <Calendar size={16} />
                      {new Date(game.startDateTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </div>
                    <div className="game-detail-item">
                      <MapPin size={16} />
                      {game.location}
                    </div>
                  </div>
                </div>

                <div className="game-footer">
                  <div className="game-poll-actions">
                    <button 
                      className={`poll-btn ${userResponse === 'available' ? 'active available' : ''}`}
                      onClick={() => handlePoll(game.id, 'available')}
                    >
                      Available
                    </button>
                    <button 
                      className={`poll-btn ${userResponse === 'tentative' ? 'active tentative' : ''}`}
                      onClick={() => handlePoll(game.id, 'tentative')}
                    >
                      Tentative
                    </button>
                    <button 
                      className={`poll-btn ${userResponse === 'unavailable' ? 'active unavailable' : ''}`}
                      onClick={() => handlePoll(game.id, 'unavailable')}
                    >
                      Unavailable
                    </button>
                  </div>
                  
                  <div className="game-poll-stats">
                    <button className="view-responses-btn" onClick={() => setSelectedVoters(voters)}>
                      <UsersIcon size={14} />
                      View Responses
                    </button>
                    <div className="game-poll-badges">
                      <span className="text-success">{voters.available.length}</span> / 
                      <span className="text-warning">{voters.tentative.length}</span> / 
                      <span className="text-danger">{voters.unavailable.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showTournamentModal && (
        <AddTournamentModal onClose={() => setShowTournamentModal(false)} />
      )}
      {showGameModal && (
        <AddGameModal onClose={() => setShowGameModal(false)} />
      )}
      {selectedVoters && (
        <ViewResponsesModal voters={selectedVoters} onClose={() => setSelectedVoters(null)} />
      )}
    </div>
  );
}
