import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '@/components/Filters/Filters';
import { NAV_TABS, VENDORS } from '@/types/game';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const noop = () => {};

describe('Filters — tab navigation', () => {
  it('renders all NAV_TABS as buttons', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    NAV_TABS.forEach(({ label }) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('marks the active tab with the active class', () => {
    render(<Filters activeTab="slots" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    const slotsBtn = screen.getByRole('button', { name: 'Slots' });
    expect(slotsBtn.className).toMatch(/active/);
  });

  it('does not mark inactive tabs as active', () => {
    render(<Filters activeTab="slots" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    const newGamesBtn = screen.getByRole('button', { name: 'New Games' });
    expect(newGamesBtn.className).not.toMatch(/active/);
  });

  it('calls onTabChange with the correct id when a tab is clicked', () => {
    const onTabChange = jest.fn();
    render(<Filters activeTab="" onTabChange={onTabChange} activeVendor="" onVendorChange={noop} />);
    fireEvent.click(screen.getByRole('button', { name: 'Slots' }));
    expect(onTabChange).toHaveBeenCalledWith('slots');
  });
});

describe('Filters — favourites button', () => {
  it('renders the favourites button', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    expect(screen.getByRole('button', { name: /show favorites/i })).toBeInTheDocument();
  });

  it('shows the "Showing favorites" label when favorites tab is active', () => {
    render(<Filters activeTab="favorites" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    expect(screen.getByRole('button', { name: /showing favorites/i })).toBeInTheDocument();
  });

  it('calls onTabChange with "favorites" when not currently active', () => {
    const onTabChange = jest.fn();
    render(<Filters activeTab="" onTabChange={onTabChange} activeVendor="" onVendorChange={noop} />);
    fireEvent.click(screen.getByRole('button', { name: /show favorites/i }));
    expect(onTabChange).toHaveBeenCalledWith('favorites');
  });

  it('calls onTabChange with "" to deactivate when favorites is active', () => {
    const onTabChange = jest.fn();
    render(<Filters activeTab="favorites" onTabChange={onTabChange} activeVendor="" onVendorChange={noop} />);
    fireEvent.click(screen.getByRole('button', { name: /showing favorites/i }));
    expect(onTabChange).toHaveBeenCalledWith('');
  });
});

describe('Filters — vendor dropdown', () => {
  it('shows "All Providers" when no vendor is selected', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    // The trigger button's accessible name comes from its text content
    expect(screen.getByRole('button', { name: /all providers/i })).toBeInTheDocument();
  });

  it('shows the selected vendor label', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="PragmaticPlay" onVendorChange={noop} />);
    // Trigger button label updates to reflect the selected vendor
    expect(screen.getByRole('button', { name: /pragmatic play/i })).toBeInTheDocument();
  });

  it('dropdown list is not visible before trigger is clicked', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    // The list is rendered in DOM but the open class controls visibility
    const trigger = screen.getByRole('button', { name: /all providers/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the dropdown on trigger click', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    const trigger = screen.getByRole('button', { name: /all providers/i });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the dropdown on a second trigger click', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    const trigger = screen.getByRole('button', { name: /all providers/i });
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onVendorChange when a vendor option is selected', () => {
    const onVendorChange = jest.fn();
    render(<Filters activeTab="" onTabChange={noop} activeVendor="" onVendorChange={onVendorChange} />);
    fireEvent.click(screen.getByRole('button', { name: /all providers/i }));
    // Use mouseDown because the handler is onMouseDown (avoids blur closing dropdown first)
    const hacksaw = screen.getByRole('option', { name: /hacksaw/i });
    fireEvent.mouseDown(hacksaw);
    expect(onVendorChange).toHaveBeenCalledWith('Hacksaw');
  });

  it('closes the dropdown after selecting a vendor', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    const trigger = screen.getByRole('button', { name: /all providers/i });
    fireEvent.click(trigger);
    const hacksaw = screen.getByRole('option', { name: /hacksaw/i });
    fireEvent.mouseDown(hacksaw);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders all vendor options in the listbox', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="" onVendorChange={noop} />);
    fireEvent.click(screen.getByRole('button', { name: /all providers/i }));
    VENDORS.forEach(({ label }) => {
      expect(screen.getByRole('option', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    });
  });

  it('marks the active vendor option as selected', () => {
    render(<Filters activeTab="" onTabChange={noop} activeVendor="Hacksaw" onVendorChange={noop} />);
    fireEvent.click(screen.getByRole('button', { name: /hacksaw/i }));
    const hacksawOption = screen.getByRole('option', { name: /hacksaw/i });
    expect(hacksawOption).toHaveAttribute('aria-selected', 'true');
  });
});
