import { act, renderHook } from '@testing-library/react';
import { useGameStore } from '@/store/useGameStore';
import type { Game } from '@/types/game';

const mockGame: Game = {
  enabled: true,
  name: 'Gates of Olympus',
  slug: 'gates-of-olympus',
  vendor: 'PragmaticPlay',
  description: 'Test game',
  thumbnail: 'https://cdn.jackpot.bet/thumbnails/test.jpg',
  thumbnailBlur: '',
  borderColor: '#5969fa',
  categories: ['VIDEOSLOTS'],
  theoreticalPayOut: 0.965,
  restrictedTerritories: [],
  hasFunMode: true,
  featured: false,
  favorite: false,
};

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      searchQuery: '',
      activeTab: '',
      activeSection: null,
      activeVendor: '',
      favoriteGames: [],
    });
  });

  it('sets search query', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => result.current.setSearchQuery('blackjack'));
    expect(result.current.searchQuery).toBe('blackjack');
  });

  it('sets active tab', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => result.current.setActiveTab('slots'));
    expect(result.current.activeTab).toBe('slots');
  });

  it('sets active vendor', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => result.current.setActiveVendor('PragmaticPlay'));
    expect(result.current.activeVendor).toBe('PragmaticPlay');
  });

  it('adds a game to favorites', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => result.current.toggleFavorite(mockGame));
    expect(result.current.favoriteGames).toHaveLength(1);
    expect(result.current.favoriteGames[0].slug).toBe('gates-of-olympus');
  });

  it('removes a game from favorites when toggled again', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => result.current.toggleFavorite(mockGame));
    act(() => result.current.toggleFavorite(mockGame));
    expect(result.current.favoriteGames).toHaveLength(0);
  });

  it('isFavorite returns true for favorited game', () => {
    const { result } = renderHook(() => useGameStore());
    act(() => result.current.toggleFavorite(mockGame));
    expect(result.current.isFavorite('gates-of-olympus')).toBe(true);
  });

  it('isFavorite returns false for non-favorited game', () => {
    const { result } = renderHook(() => useGameStore());
    expect(result.current.isFavorite('gates-of-olympus')).toBe(false);
  });
});
