import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Game, GameSection } from '@/types/game';

interface GameStore {
  searchQuery: string;
  activeTab: string;
  activeSection: GameSection | null;
  activeVendor: string;
  favoriteGames: Game[];
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
  setActiveSection: (section: GameSection | null) => void;
  setActiveVendor: (vendor: string) => void;
  toggleFavorite: (game: Game) => void;
  isFavorite: (slug: string) => boolean;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      activeTab: '',
      activeSection: null,
      activeVendor: '',
      favoriteGames: [],
      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setActiveSection: (section) => set({ activeSection: section }),
      setActiveVendor: (vendor) => set({ activeVendor: vendor }),
      toggleFavorite: (game) => {
        const { favoriteGames } = get();
        const exists = favoriteGames.some((g) => g.slug === game.slug);
        set({
          favoriteGames: exists
            ? favoriteGames.filter((g) => g.slug !== game.slug)
            : [...favoriteGames, game],
        });
      },
      isFavorite: (slug) => get().favoriteGames.some((g) => g.slug === slug),
    }),
    {
      name: 'jackpot-game-store',
      partialize: (state) => ({ favoriteGames: state.favoriteGames }),
    }
  )
);
