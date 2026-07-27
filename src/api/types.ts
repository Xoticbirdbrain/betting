

export interface GetCompetitionsParams {
  areas?: string; 
}

export interface GetStandingsParams {
  matchday?: number;
  season?: string; 
  date?: string;   
}

export interface GetCompetitionMatchesParams {
  dateFrom?: string; 
  dateTo?: string;  
  stage?: string;    // e.g., "REGULAR_SEASON", "PLAYOFFS"
  status?: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'SUSPENDED' | 'CANCELLED';
  matchday?: number;
  group?: string;
  season?: string;   //(e.g., "2026")
}

export interface GetTeamsParams {
  season?: string;   //(e.g., "2026")
}

export interface GetTeamsGlobalParams {
  limit?: number;
  offset?: number;
}

export interface GetScorersParams {
  limit?: number;
  season?: string;   // Format: YYYY (e.g., "2026")
}

export interface GetTeamMatchesParams {
  dateFrom?: string;
  dateTo?: string;
  season?: string;
  competitions?: string; // Comma-separated list of competition IDs
  status?: string;
  venue?: 'HOME' | 'AWAY';
  limit?: number;
}

export interface GetPersonMatchesParams {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  competitions?: string; // Comma-separated list of competition IDs
  limit?: number;
  offset?: number;
}

export interface GetGlobalMatchesParams {
  competitions?: string; // Comma-separated list of competition IDs (e.g., "PL,BL1")
  ids?: string;          // Comma-separated list of match IDs
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}

export interface GetH2HParams {
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  competitions?: string;
}

// ==========================================
// 2. CORE SUB-RESOURCES & DATA STRUCTURES
// ==========================================

export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string | null;
}

export interface Competition {
  id: number;
  area: Area;
  name: string;
  code: string;
  type: string;
  emblem: string | null;
}

export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: TeamSummary | null;
}

export interface TeamSummary {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  dateOfBirth: string;
  nationality: string;
  contract: {
    start: string | null;
    until: string | null;
  };
}

export interface Player {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Team extends TeamSummary {
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  runningCompetitions: Competition[];
  coach: Coach;
  squad: Player[];
  staff: any[];
  lastUpdated: string;
}

export interface Person {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  section: string;
  position: string | null;
  shirtNumber: number | null;
  lastUpdated: string;
  currentTeam: TeamSummary;
}

export interface MatchScore {
  winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
  duration: 'REGULAR' | 'EXTRA_TIME' | 'PENALTY_SHOOTOUT';
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export interface Match {
  id: number;
  area: Area;
  competition: Competition;
  season: Season;
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
  score: MatchScore;
  odds?: { msg: string };
  referees: Array<{ id: number; name: string; type: string; nationality: string }>;
}

export interface StandingTableEntry {
  position: number;
  team: TeamSummary;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface Standing {
  stage: string;
  type: 'TOTAL' | 'HOME' | 'AWAY';
  group: string | null;
  table: StandingTableEntry[];
}

// ==========================================
// 3. ROOT ROOT API RESPONSE INTERFACES
// ==========================================

export interface AreasResponse {
  count: number;
  filters: Record<string, any>;
  areas: Area[];
}

export interface CompetitionsResponse {
  count: number;
  filters: Record<string, any>;
  competitions: Competition[];
}

export interface StandingsResponse {
  filters: GetStandingsParams;
  competition: Competition;
  season: Season;
  standings: Standing[];
}

export interface MatchesResponse {
  filters: Record<string, any>;
  resultSet: {
    count: number;
    first: string;
    last: string;
    played: number;
  };
  competition: Competition;
  matches: Match[];
}

export interface TeamsResponse {
  count: number;
  filters: Record<string, any>;
  competition: Competition;
  season: Season;
  teams: Team[];
}

export interface ScorersResponse {
  count: number;
  filters: Record<string, any>;
  competition: Competition;
  season: Season;
  scorers: Array<{
    player: Player;
    team: TeamSummary;
    goals: number;
    assists: number | null;
    penalties: number | null;
  }>;
}

export interface HeadToHeadResponse {
  filters: Record<string, any>;
  aggregates: {
    numberOfMatches: number;
    totalGoals: number;
    homeTeam: { id: number; name: string; wins: number; draws: number; losses: number };
    awayTeam: { id: number; name: string; wins: number; draws: number; losses: number };
  };
  matches: Match[];
}
