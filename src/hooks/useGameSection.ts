import { useInfiniteQuery } from '@tanstack/react-query';
import { fetcher } from '@/api/fetcher';
import { buildGamesParams, getNextGamesPageParam } from '@/api/games';
import type { GamesResponse, GamesParams } from '@/types/game';

export function useGameSection(sectionId: string, params: GamesParams) {
  return useInfiniteQuery({
    queryKey: ['section', sectionId, params],
    queryFn: ({ pageParam, signal }) =>
      fetcher<GamesResponse>('/api/games', { params: buildGamesParams(pageParam, params), signal }),
    initialPageParam: 0,
    getNextPageParam: getNextGamesPageParam,
    staleTime: 2 * 60 * 1000,
  });
}
