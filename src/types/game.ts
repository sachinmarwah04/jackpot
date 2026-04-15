export interface Game {
  enabled: boolean;
  name: string;
  slug: string;
  vendor: string;
  description: string;
  thumbnail: string;
  thumbnailBlur: string;
  borderColor: string;
  categories: string[];
  theoreticalPayOut: number;
  restrictedTerritories: string[];
  hasFunMode: boolean;
  featured: boolean;
  favorite: boolean;
}

export interface GamesResponse {
  success: boolean;
  data: {
    count: number;
    total: number;
    items: Game[];
  };
}

export interface SearchResponse {
  success: boolean;
  data: {
    items: Game[];
  };
}

export interface GamesParams {
  category?: string;
  vendor?: string | string[];
  sort?: string;
  order?: string;
  excludeCategory?: string;
}

export interface GameSection {
  id: string;
  label: string;
  iconImage: string;
  params: GamesParams;
}

export const GAME_SECTIONS: GameSection[] = [
  {
    id: 'jackpot',
    label: 'Jackpot Originals',
    iconImage: '/icons/sections/jackpot-originals.svg',
    params: { vendor: 'JackpotOriginal' },
  },
  {
    id: 'new',
    label: 'New Games',
    iconImage: '/icons/sections/new-games.svg',
    params: { sort: 'createdAt', order: 'desc' },
  },
  {
    id: 'slots',
    label: 'Slots',
    iconImage: '/icons/sections/slots.svg',
    params: { category: 'VIDEOSLOTS' },
  },
  {
    id: 'featured',
    label: 'Featured Games',
    iconImage: '/icons/sections/featured.png',
    params: { sort: 'featuredPriority', order: 'desc' },
  },
  {
    id: 'game-shows',
    label: 'Game Shows',
    iconImage: '/icons/sections/game-shows.svg',
    params: { vendor: 'Hacksaw' },
  },
  {
    id: 'table',
    label: 'Table Games',
    iconImage: '/icons/sections/table-games.svg',
    params: { category: 'TABLEGAMES' },
  },
  {
    id: 'sports',
    label: 'Sports',
    iconImage: '/icons/sections/sports.svg',
    params: { category: 'SPORTS' },
  },
];

export const NAV_TABS = [
  ...GAME_SECTIONS.slice(0, 4).map((s) => ({ id: s.id, label: s.label })), // jackpot, new, slots, featured
  { id: 'live', label: 'Live Dealer' },
  ...GAME_SECTIONS.slice(4).filter((s) => s.id !== 'sports').map((s) => ({ id: s.id, label: s.label })), // game-shows, table
];

export interface Promo {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
}

export const PROMOS: Promo[] = [
  {
    id: '1',
    title: '$JACKPOT Airdrop',
    subtitle: 'Win your share of the prize pool',
    tag: 'AIRDROP',
    image: '/promos/airdrop.jpg',
  },
  {
    id: '2',
    title: '$10,000 Wager Race',
    subtitle: 'Race to the top this week',
    tag: 'RACE',
    image: '/promos/wager-race.jpg',
  },
  {
    id: '3',
    title: 'Hacksaw Cash Combat',
    subtitle: 'Fight for massive wins',
    tag: 'SLOTS',
    image: '/promos/hacksaw.jpg',
  },
  {
    id: '4',
    title: 'Highest Multiplier',
    subtitle: 'Claim your place on the leaderboard',
    tag: 'LEADERBOARD',
    image: '/promos/multiplier.jpg',
  },
  {
    id: '5',
    title: 'Ace Race',
    subtitle: 'Deal the best hand daily',
    tag: 'BLACKJACK',
    image: '/promos/ace-race.jpg',
  },
  {
    id: '6',
    title: 'VIP Matching',
    subtitle: 'Exclusive rewards for VIP players',
    tag: 'VIP',
    image: '/promos/vip.jpg',
  },
  {
    id: '7',
    title: 'Affiliate Program',
    subtitle: 'Earn more with every referral',
    tag: 'AFFILIATE',
    image: '/promos/affiliate.jpg',
  },
  {
    id: '8',
    title: 'New Providers',
    subtitle: 'Explore the latest games',
    tag: 'NEW',
    image: '/promos/providers.jpg',
  },
];

export const VENDORS = [
  { value: '', label: 'All Providers' },
  { value: 'PragmaticPlay', label: 'Pragmatic Play' },
  { value: 'EvolutionGaming', label: 'Evolution Gaming' },
  { value: 'JackpotOriginal', label: 'Jackpot Original' },
  { value: "Play'nGo", label: "Play'n GO" },
  { value: 'RelaxGaming', label: 'Relax Gaming' },
  { value: 'BGaming', label: 'BGaming' },
  { value: 'Hacksaw', label: 'Hacksaw' },
];
