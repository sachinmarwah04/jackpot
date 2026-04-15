import { render, screen, fireEvent } from '@testing-library/react';
import GameCard, { GameCardSkeleton } from '@/components/GameCard/GameCard';
import { useGameStore } from '@/store/useGameStore';
import type { Game } from '@/types/game';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockGame: Game = {
  enabled: true,
  name: 'Gates of Olympus',
  slug: 'gates-of-olympus',
  vendor: 'PragmaticPlay',
  description: 'A great slot game',
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

describe('GameCard', () => {
  beforeEach(() => {
    useGameStore.setState({ favoriteGames: [] });
  });

  it('renders the game image with correct alt text', () => {
    render(<GameCard game={mockGame} />);
    expect(screen.getByAltText('Gates of Olympus')).toBeInTheDocument();
  });

  it('renders the favorite button', () => {
    render(<GameCard game={mockGame} />);
    expect(screen.getByRole('button', { name: /add to favorites/i })).toBeInTheDocument();
  });

  it('toggles favorite on button click', () => {
    render(<GameCard game={mockGame} />);
    const btn = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(btn);
    expect(useGameStore.getState().isFavorite('gates-of-olympus')).toBe(true);
  });

  it('shows remove label when game is already favorited', () => {
    useGameStore.setState({ favoriteGames: [mockGame] });
    render(<GameCard game={mockGame} />);
    expect(screen.getByRole('button', { name: /remove from favorites/i })).toBeInTheDocument();
  });

  it('applies borderColor as background style', () => {
    render(<GameCard game={mockGame} />);
    const article = screen.getByRole('article');
    expect(article).toHaveStyle({ background: '#5969fa' });
  });
});

describe('GameCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<GameCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
