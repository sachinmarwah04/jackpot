# Jackpot.bet — Frontend Challenge

A responsive casino game lobby built with Next.js, demonstrating advanced search, filtering, infinite scroll, and state persistence.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test          # run unit tests
npm run build     # production build
```

---

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | Server components, API routes, image optimisation out of the box |
| Data fetching | TanStack React Query v5 | Normalised cache, infinite scroll via `useInfiniteQuery`, built-in stale/loading/error states |
| State | Zustand v5 | Minimal boilerplate, built-in `persist` middleware for localStorage favourites |
| Styling | SCSS Modules | Scoped styles with no runtime cost; native nesting + `@for` loops for stagger animations |
| Testing | Jest + React Testing Library | Idiomatic React testing focused on user behaviour, not implementation details |

---

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── games/route.ts          # GET /api/games  (paginated)
│   │   └── games/search/route.ts   # GET /api/games/search
│   ├── layout.tsx                  # Root layout — QueryProvider, font, liquid-glass SVG filter
│   └── page.tsx                    # Entry — renders <GameLobby />
│
├── components/
│   ├── Header/         # Sticky header — logo resets all state on click
│   ├── GameLobby/      # Orchestration — decides which view to render
│   ├── GameRow/        # Horizontal infinite-scroll carousel per section
│   ├── GameCard/       # Individual card — image, favourite button, animations
│   ├── Filters/        # Category tabs + provider dropdown + favourites toggle
│   ├── SearchBar/      # Controlled input
│   └── FlyingHeart/    # Portal-based particle system for favourite animations
│
├── hooks/
│   ├── useGames.ts         # Infinite query — main paginated list
│   ├── useGameSection.ts   # Infinite query — single section row
│   ├── useGameSearch.ts    # Standard query — search results
│   └── useDebounce.ts      # Generic debounce for search input
│
├── store/
│   └── useGameStore.ts     # activeTab, activeSection, activeVendor, searchQuery, favouriteGames
│
└── types/
    └── game.ts             # Game, GamesResponse, GamesParams, GameSection, VENDORS, NAV_TABS
```

---

## Key Implementation Decisions

### 1. Three distinct view modes in GameLobby

`GameLobby` renders one of three mutually exclusive views driven by Zustand state:

| Mode | Trigger | Component |
|---|---|---|
| **Sections** (default) | No search, no vendor, no section | `<GameRow />` per `GAME_SECTIONS` |
| **Grid** | Search active, vendor selected, or "View All" clicked | Full paginated grid |
| **Favourites** | Favourites tab active | Persisted `favoriteGames[]` from store |

This avoids a deeply conditional single component and keeps each view self-contained.

### 2. React Query cache keys include all params

```ts
queryKey: ['games', params]   // params = { vendor, category, sort, order }
```

Changing any filter immediately serves the correct cached data or re-fetches — no stale results leaked across filter changes.

### 3. Vendor filter as a dedicated grid view

Rather than injecting a vendor param into each section row, selecting a vendor switches to the full grid view with `{ vendor }` as the sole query param. This is architecturally clean: rows always show their own data; the grid shows filtered data.

### 4. Favourite persistence stores full Game objects

Zustand `persist` serialises `favoriteGames: Game[]` to localStorage. This means the Favourites tab renders instantly with full card data, with no API call needed.

### 5. Flying heart animation — custom event bus

`GameCard` dispatches `window.dispatchEvent(new CustomEvent('heart:fly', { detail: { fromX, fromY } }))`. A portal-based `FlyingHeartLayer` component listens, reads the favourites button's position via `document.querySelector('[data-fav-btn]')`, and animates a particle between the two points using a two-element arc technique (X: linear, Y: ease-in) — no shared React state needed.

### 6. Scroll performance

- `will-change: transform` on each card promotes it to a compositor layer — scroll never triggers card repaints.
- `content-visibility: auto` on each section row skips off-screen paint entirely.
- Carousel arrows use a custom `requestAnimationFrame` scroll with `easeOutQuart` easing instead of native `scrollBy({ behavior: 'smooth' })` for consistent cross-browser feel.

---

## API Integration

All requests are proxied through Next.js API routes to avoid CORS and to enable edge-side caching (`revalidate: 60`).

### `GET /api/games`

| Param | Type | Description |
|---|---|---|
| `limit` | number | Page size (default 20) |
| `offset` | number | Pagination offset |
| `category` | string | e.g. `VIDEOSLOTS`, `TABLEGAMES` |
| `vendor` | string (repeatable) | e.g. `vendor=PragmaticPlay&vendor=Hacksaw` |
| `sort` | string | e.g. `createdAt`, `featuredPriority` |
| `order` | string | `asc` \| `desc` |

### `GET /api/games/search`

| Param | Type | Description |
|---|---|---|
| `query` | string | URL-encoded search term |

---

## Features

- **Real-time search** with 300 ms debounce — results update as you type
- **Category tabs** — Jackpot Originals, New Games, Slots, Featured, Live Dealer, Game Shows, Table Games
- **Provider filter** — custom dropdown with 8 vendors; selecting one opens a dedicated filtered grid
- **Favourites** — heart button on every card; persisted to localStorage; accessible via the ♥ button in the filter bar with a flying-heart particle animation
- **Infinite scroll** — both section rows (horizontal) and grid view (vertical) load more automatically
- **Coming Soon** — sections/tabs with no API data show ghost cards or a full-page placeholder
- **Responsive** — 2-column mobile grid up to 6-column desktop; cards scale 135px → 171px

---

## Bonus Features Implemented

| Requirement | Implementation |
|---|---|
| Advanced filters | Provider dropdown (8 vendors), category tabs, favourites toggle |
| Animations & transitions | Card entry stagger, hover effects, shimmer skeleton, flying heart particle system, carousel easing |
| Unit tests | 17 tests across GameCard, SearchBar, Filters, useDebounce, useGameStore |
| Favourites with persistence | Zustand persist → localStorage; full Game objects stored for offline rendering |
