
import { useQuery } from '@tanstack/react-query';
import { footballDashboardHub } from '@/api/endpoints';
import type {GetGlobalMatchesParams} from '@/api/types'




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
  

  
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    
    queryKey: ['globalMatches',], 
    queryFn: async (): Promise<MatchesResponse> => {
       const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

  
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const leagues = ['PL', 'BL1', 'PD', 'SA', 'FL1', 'CL'];

   const fetchPromises = leagues.map(league => {
      const queryparams: GetGlobalMatchesParams = {
        competitions: league, // Pass one league code at a time
        dateFrom: formatDate(today),
        dateTo: formatDate(sevenDaysLater),
        status: 'SCHEDULED' 
      };
      return footballDashboardHub.getMatches(queryparams);
    });

    
    const responses = await Promise.all(fetchPromises);

    
    const combinedMatches = responses.reduce((acc, curr) => {
      if (curr && curr.matches) {
        return acc.concat(curr.matches);
      }
      return acc;
    }, [] as any[]);

    return { matches: combinedMatches };},
    staleTime: 1000 * 60 * 10,
     refetchOnWindowFocus: false, 
  retry: 1,  
  
  select:(rawResponse: any): MatchesResponse => {

   if(!rawResponse || !rawResponse.matches)
   {    return {matches: [] }      }

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
      <header className="flex justify-center items-center mb-6">
        <h1 className="text-2xl text-center font-bold text-gray-900">Upcoming Fixtures This Week</h1>
        
      </header>

      <div className="grid gap-4">
        {data?.matches && data.matches.length > 0 ? (
          data.matches.map((match: Match) => (
            <div key={match.id} className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-center  sm:flex-col md:flex-col hover:shadow-md transition">
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

  