import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { footballDashboardHub } from '@/api/endpoints';

export const FootballDashboard: React.FC = () => {
  // 1. Maintain state for user selections
  const [selectedLeague, setSelectedLeague] = useState<string>('PL');

  
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    // The queryKey tracks dependencies; changing selectedLeague triggers an auto-refetch
    queryKey: ['competitionMatches', selectedLeague], 
    queryFn: () => footballDashboardHub.getCompetitionMatches(selectedLeague, {
       // Targets the upcoming 2026/2027 season
      status: 'SCHEDULED' // Safely queries future fixtures
    }),
    staleTime: 1000 * 60 * 5,
     refetchOnWindowFocus: false, 
  retry: 1,     
    
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
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Fixtures ({data?.competition.name})</h1>
        
        
        <select 
          className="border p-2 rounded bg-white shadow-sm font-medium"
          value={selectedLeague} 
          onChange={(e) => setSelectedLeague(e.target.value)}
        >
          <option value="PL">English Premier League</option>
          <option value="BL1">German Bundesliga</option>
          <option value="PD">Spanish La Liga</option>
          <option value="SA">Italian Serie A</option>
          <option value='DED'>Eredivisie</option>
        </select>
      </header>

      {/* 4. Map safely through your strongly-typed matches array */}
      <div className="grid gap-4">
        {data?.matches && data.matches.length > 0 ? (
          data.matches.map((match) => (
            <div key={match.id} className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-center  sm:flex-col md:flex-col hover:shadow-md transition">
              <div className="flex-1 text-right pr-4 font-semibold text-gray-800">{match.homeTeam.name}</div>
              <div className="bg-gray-100 text-xs px-3 py-1.5 rounded-full font-mono font-medium text-gray-600">
                {new Date(match.utcDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex-1 text-left pl-4 font-semibold text-gray-800">{match.awayTeam.name}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-12">No upcoming matches scheduled for this season yet.</div>
        )}
      </div>
    </div>
  );
};

export default FootballDashboard;

  