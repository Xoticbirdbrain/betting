import {useState} from 'react'
import { useQuery } from '@tanstack/react-query';
import { footballDashboardHub } from '@/api/endpoints';

export interface GetCompetitionMatchesParams {
  dateFrom?: string; 
  dateTo?: string;  
  stage?: string;    // e.g., "REGULAR_SEASON", "PLAYOFFS"
  status?: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'SUSPENDED' | 'CANCELLED';
  matchday?: number;
  group?: string;
  season?: string;   //(e.g., "2026")
}


export interface Match {
  id: number;
  utcDate: string;
  status: string;
  competition: { name: string; code: string };
  homeTeam: { name: string };
  awayTeam: { name: string };
}


export interface MatchesResponse {
  matches: Match[];
}


export const FootballDashboard: React.FC = () => {
  
  const [selectedLeague, setSelectedLeague] = useState<string>('PL');
  
  const { data, isLoading, isError, error } = useQuery({
  queryKey: ['globalMatches', selectedLeague],
  queryFn: () => {
     
    
return footballDashboardHub.getCompetitionMatches(selectedLeague);
  
  
  }
   
  , 
  staleTime: 1000 * 60 * 10,
  refetchOnWindowFocus: false,
  retry: 1,
  select: (rawResponse: any): MatchesResponse => {
    if (!rawResponse || !rawResponse.matches) {
      return { matches: [] };
    }
   return rawResponse;
  }
});

if (isLoading) {
  return <div className="p-8 text-center text-gray-500 animate-pulse">Loading fixtures...</div>;
}

if (isError) {
  return (
    <div className="p-8 text-center text-red-500">
      Error loading data: {error instanceof Error ? error.message : 'Unknown error'}
    </div>
  );
}
  

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl text-center font-bold text-gray-900">Upcoming Fixtures This Week</h1>
        
  
  
  <div className="flex items-center gap-2">
    <label htmlFor="league-select" className="text-sm font-medium text-gray-700">
      League:
    </label>
    <select
      id="league-select"
      value={selectedLeague}
      onChange={(e) => setSelectedLeague(e.target.value)}
      className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="PL">Premier League (PL)</option>
      <option value="BL1">Bundesliga (BL1)</option>
      <option value="PD">La Liga (PD)</option>
      <option value="SA">Serie A (SA)</option>
      <option value='DED'>Eredivisie (DED)</option>
      <option value='FL1'>French League 1 (FL1)</option>
      <option value='CL' >Champions League (CL)</option>
    </select>
  </div>


      </header>
 
    <div className="grid  gap-4">
        {data?.matches && data.matches.length > 0 ? (
          data.matches.map((match: Match) => (
            <div key={match.id} className="border p-4 rounded-lg bg-white shadow-sm flex flex-col justify-between items-center sm:flex-row md:flex-row hover:shadow-md transition">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
          {match.competition?.name ?? 'International Cup'}
           </div>
              
              <div className="flex-1 text-right pr-4 font-semibold text-gray-800">{match.homeTeam?.name ?? 'Unknown Team'}</div>
              <div className="bg-gray-100 text-xs px-3 py-1.5 rounded-full font-mono font-medium text-gray-600">
              
               {match?.utcDate 
                  ? new Date(match.utcDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                  : 'TBD'
                }
              
              
              
              </div>

              <div className="flex-1 text-left pl-4 font-semibold text-gray-800">{match.awayTeam?.name ?? 'Unknown Away Team'}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-12">No upcoming matches scheduled for this week.</div>
        )}
      </div>
    </div>
  );
};

export default FootballDashboard;

  