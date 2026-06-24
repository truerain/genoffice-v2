/**
 * @file packages/ui/test/core/Calendar.test.tsx
 * @description Tests for Calendar (DayPicker v10 wrapper).
 * @created 2026-06-24
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from '../../src/core/calendar/Calendar';

describe('Calendar', () => {
  it('renders a month grid with navigation', () => {
    render(<Calendar />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();
  });

  it('selects a day in single mode', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 5, 1)}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByRole('button', { name: /june 15th, 2026/i }));
    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][0]).toBeInstanceOf(Date);
  });
});
