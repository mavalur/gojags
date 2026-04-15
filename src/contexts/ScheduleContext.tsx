import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Tournament, Game, GamePoll, AvailabilityResponse } from '../types';
import * as scheduleService from '../services/schedule.service';

interface ScheduleContextValue {
  tournaments: Tournament[];
  games: Game[];
  polls: GamePoll[];
  addTournament: (name: string) => void;
  deleteTournament: (id: string) => void;
  addGame: (game: Omit<Game, 'id'>) => void;
  deleteGame: (id: string) => void;
  setAvailability: (gameId: string, userId: string, response: AvailabilityResponse) => void;
  getPollForGame: (gameId: string) => GamePoll;
  refresh: () => void;
}

const ScheduleContext = createContext<ScheduleContextValue | null>(null);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [polls, setPolls] = useState<GamePoll[]>([]);

  const refresh = useCallback(() => {
    setTournaments(scheduleService.getTournaments());
    setGames(scheduleService.getGames());
    setPolls(scheduleService.getPolls());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTournament = useCallback((name: string) => {
    scheduleService.addTournament(name);
    refresh();
  }, [refresh]);

  const deleteTournament = useCallback((id: string) => {
    scheduleService.deleteTournament(id);
    refresh();
  }, [refresh]);

  const addGame = useCallback((game: Omit<Game, 'id'>) => {
    scheduleService.addGame(game);
    refresh();
  }, [refresh]);

  const deleteGame = useCallback((id: string) => {
    scheduleService.deleteGame(id);
    refresh();
  }, [refresh]);

  const setAvailability = useCallback((gameId: string, userId: string, response: AvailabilityResponse) => {
    scheduleService.setUserAvailability(gameId, userId, response);
    refresh();
  }, [refresh]);

  const getPollForGame = useCallback((gameId: string) => {
    return polls.find(p => p.gameId === gameId) ?? { gameId, responses: {} };
  }, [polls]);

  return (
    <ScheduleContext.Provider
      value={{
        tournaments,
        games,
        polls,
        addTournament,
        deleteTournament,
        addGame,
        deleteGame,
        setAvailability,
        getPollForGame,
        refresh
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedule must be used inside <ScheduleProvider>');
  return ctx;
}
