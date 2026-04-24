import type { GamesResponse, GamesParams } from '@/types/game';

const PAGE_LIMIT = 20;

export function buildGamesParams(pageParam: number, params: GamesParams, limit = PAGE_LIMIT) {
  return {
    limit,
    offset: pageParam,
    ...(params.category && { category: params.category }),
    ...(params.vendor && { vendor: Array.isArray(params.vendor) ? params.vendor : [params.vendor] }),
    ...(params.sort && { sort: params.sort }),
    ...(params.order && { order: params.order }),
    ...(params.excludeCategory && { excludeCategory: params.excludeCategory }),
  };
}

export function getNextGamesPageParam(
  lastPage: GamesResponse,
  allPages: GamesResponse[],
): number | undefined {
  const fetched = allPages.reduce((acc, p) => acc + p.data.count, 0);
  return fetched < lastPage.data.total ? fetched : undefined;
}
