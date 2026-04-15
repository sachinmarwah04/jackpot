import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://jpapi-staging.jackpot.bet';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query') ?? '';

  try {
    const res = await fetch(
      `${BASE_URL}/casino/games/search?query=${encodeURIComponent(query)}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to search games' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
