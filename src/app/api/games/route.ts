import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://jpapi-staging.jackpot.bet';

export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);

  try {
    const res = await fetch(`${BASE_URL}/casino/games?${params}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch games' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
