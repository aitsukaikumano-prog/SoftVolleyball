
export type GroupType = 'A' | 'B';

export interface SetScore {
  team1: number | null;
  team2: number | null;
}

export interface MatchResult {
  id: string;
  group: GroupType;
  matchNumber: number; // 試合番号
  team1Id: string;
  team2Id: string;
  referee: string;    // 審判
  sets: SetScore[];
  isCompleted: boolean;
}

export interface Team {
  id: string;
  name: string;
  group: GroupType;
}

export interface TeamStats {
  teamId: string;
  name: string;
  points: number;
  totalGained: number;
  totalLost: number;
  scoreDiff: number;
  rank: number;
  matchesPlayed: number;
}

export interface TournamentData {
  teams: Team[];
  matches: MatchResult[];
  lastUpdated: string;
}

export enum UserRole {
  ADMIN = 'admin',
  GENERAL = 'general'
}
