import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar/SearchBar';

describe('SearchBar', () => {
  it('renders the search input', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="blackjack" onChange={() => {}} />);
    expect(screen.getByRole('searchbox')).toHaveValue('blackjack');
  });

  it('calls onChange when user types', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'slots' } });
    expect(onChange).toHaveBeenCalledWith('slots');
  });

  it('calls onChange with empty string when cleared', () => {
    const onChange = jest.fn();
    render(<SearchBar value="slots" onChange={onChange} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith('');
  });
});
