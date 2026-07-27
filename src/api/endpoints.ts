import { fetchFromHub } from './FootballApi';
import * as Types from './types.ts';


{/* All other End Points to be used at a later stage - Luke Spandill */}

export const footballDashboardHub = {

  getAreas: () => 
    fetchFromHub<Types.AreasResponse>("/areas"),

  getAreaById: (id: number) => 
    fetchFromHub<Types.Area>(`/areas/${id}`),


  getCompetitions: (params?: Types.GetCompetitionsParams) => 
    fetchFromHub<Types.CompetitionsResponse>("/competitions", params),

  getCompetitionById: (id: string | number) => 
    fetchFromHub<Types.Competition>(`/competitions/${id}`),

  getCompetitionStandings: (id: string | number, params?: Types.GetStandingsParams) => 
    fetchFromHub<Types.StandingsResponse>(`/competitions/${id}/standings`, params),

  getCompetitionMatches: (id: string | number, params?: Types.GetCompetitionMatchesParams) => 
    fetchFromHub<Types.MatchesResponse>(`/competitions/${id}/matches`, params),

  getCompetitionTeams: (id: string | number, params?: Types.GetTeamsParams) => 
    fetchFromHub<Types.TeamsResponse>(`/competitions/${id}/teams`, params),

  getCompetitionScorers: (id: string | number, params?: Types.GetScorersParams) => 
    fetchFromHub<Types.ScorersResponse>(`/competitions/${id}/scorers`, params),

  
  getTeams: (params?: Types.GetTeamsGlobalParams) => 
    fetchFromHub<Types.TeamsResponse>("/teams", params),

  getTeamById: (id: number) => 
    fetchFromHub<Types.Team>(`/teams/${id}`),

  getTeamMatches: (id: number, params?: Types.GetTeamMatchesParams) => 
    fetchFromHub<Types.MatchesResponse>(`/teams/${id}/matches`, params),

  
  getPersonById: (id: number) => 
    fetchFromHub<Types.Person>(`/persons/${id}`),

  getPersonMatches: (id: number, params?: Types.GetPersonMatchesParams) => 
    fetchFromHub<Types.MatchesResponse>(`/persons/${id}/matches`, params),

  getMatches: (params?: Types.GetGlobalMatchesParams) => 
    fetchFromHub<Types.MatchesResponse>("/matches", params),

  getMatchById: (id: number) => 
    fetchFromHub<Types.Match>(`/matches/${id}`),

  getMatchHeadToHead: (id: number, params?: Types.GetH2HParams) => 
    fetchFromHub<Types.HeadToHeadResponse>(`/matches/${id}/head2head`, params),
};
