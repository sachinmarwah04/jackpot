import { useQuery } from '@tanstack/react-query';
import type { SearchResponse } from '@/types/game';

async function searchGames(query: string): Promise<SearchResponse> {
  const res = await fetch(`/api/games/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search games');
  return res.json();
}

export function useGameSearch(query: string) {
  return useQuery({
    queryKey: ['games-search', query],
    queryFn: () => searchGames(query),
    enabled: query.trim().length > 0,
    staleTime: 30 * 1000,
  });
}
