import type { Tournament, Game, GamePoll, AvailabilityResponse } from '../types';

const TOURNAMENTS_KEY = 'team_finance_tournaments';
const GAMES_KEY = 'team_finance_games';
const POLLS_KEY = 'team_finance_polls';

function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

// ---- Tournaments ----
export function getTournaments(): Tournament[] {
  const raw = localStorage.getItem(TOURNAMENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveTournaments(tournaments: Tournament[]) {
  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments));
}

export function addTournament(name: string): Tournament {
  const t = getTournaments();
  const newT: Tournament = {
    id: generateId(),
    name,
    createdAt: new Date().toISOString()
  };
  t.unshift(newT);
  saveTournaments(t);
  return newT;
}

export function deleteTournament(id: string): void {
  let t = getTournaments();
  t = t.filter(x => x.id !== id);
  saveTournaments(t);
  // Optional: delete associated games
  let g = getGames();
  g = g.filter(x => x.tournamentId !== id);
  saveGames(g);
}

// ---- Games ----
export function getGames(): Game[] {
  const raw = localStorage.getItem(GAMES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveGames(games: Game[]) {
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

export function addGame(game: Omit<Game, 'id'>): Game {
  const g = getGames();
  const newG: Game = { ...game, id: generateId() };
  g.push(newG);
  // Sort by nearest startDateTime
  g.sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  saveGames(g);
  return newG;
}

export function deleteGame(id: string): void {
  let g = getGames();
  g = g.filter(x => x.id !== id);
  saveGames(g);
}

// ---- Polls ----
export function getPolls(): GamePoll[] {
  const raw = localStorage.getItem(POLLS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function savePolls(polls: GamePoll[]) {
  localStorage.setItem(POLLS_KEY, JSON.stringify(polls));
}

export function getPollByGame(gameId: string): GamePoll {
  const polls = getPolls();
  return polls.find(p => p.gameId === gameId) ?? { gameId, responses: {} };
}

export function setUserAvailability(gameId: string, userId: string, response: AvailabilityResponse) {
  const polls = getPolls();
  const idx = polls.findIndex(p => p.gameId === gameId);
  
  if (idx === -1) {
    polls.push({ gameId, responses: { [userId]: response } });
  } else {
    polls[idx].responses[userId] = response;
  }
  
  savePolls(polls);
}
