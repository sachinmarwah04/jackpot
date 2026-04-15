import { useInfiniteQuery } from '@tanstack/react-query';
import type { GamesResponse, GamesParams } from '@/types/game';

const LIMIT = 20;

async function fetchGames(pageParam: number, params: GamesParams): Promise<GamesResponse> {
  const p = new URLSearchParams({
    limit: String(LIMIT),
    offset: String(pageParam),
  });
  if (params.category) p.set('category', params.category);
  if (params.vendor) {
    const vendors = Array.isArray(params.vendor) ? params.vendor : [params.vendor];
    vendors.forEach((v) => p.append('vendor', v));
  }
  if (params.sort) p.set('sort', params.sort);
  if (params.order) p.set('order', params.order);
  if (params.excludeCategory) p.set('excludeCategory', params.excludeCategory);

  const res = await fetch(`/api/games?${p}`);
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
}

export function useGames(params: GamesParams) {
  return useInfiniteQuery({
    queryKey: ['games', params],
    queryFn: ({ pageParam }) => fetchGames(pageParam as number, params),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const total = allPages.reduce((acc, p) => acc + (p.data.items?.length ?? 0), 0);
      if (total >= lastPage.data.total) return undefined;
      return total;
    },
  });
}
