// ---- User & Auth Types ----
export type UserRole = 'viewer' | 'editor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

// ---- Finance Types ----
export type TransactionType = 'income' | 'expense';

export type Category =
  | 'contribution'
  | 'refunds'
  | 'tournament_fee'
  | 'tournament_balls'
  | 'team_expenses_gears'
  | 'team_building'
  | 'ground_expenses';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: Category;
  amount: number;
  description: string;
  date: string;
  createdBy: string; // user id
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}

// ---- Theme ----
export type Theme = 'dark' | 'light';

// ---- Scheduling & Polling ----
export interface Tournament {
  id: string;
  name: string;
  createdAt: string;
}

export type AvailabilityResponse = 'available' | 'unavailable' | 'tentative';

export interface Game {
  id: string;
  tournamentId?: string; // Optional for practice or ad-hoc games
  opponent: string;      
  location: string;      
  startDateTime: string; // ISO date string
  type: 'game' | 'practice';
}

// Map of userId -> Response
export type GamePollResponses = Record<string, AvailabilityResponse>;

export interface GamePoll {
  gameId: string;
  responses: GamePollResponses;
}
