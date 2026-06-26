/**
 * @file packages/ui/test/composed/DatePicker.test.tsx
 * @description Tests for DatePicker composed family (C5b).
 * @created 2026-06-25
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '../../src/composed/datePicker/DatePicker';
import { MonthPicker } from '../../src/composed/datePicker/MonthPicker';
import { RangeDatePicker } from '../../src/composed/datePicker/RangeDatePicker';

describe('DatePicker', () => {
  it('formats typed ymd input via MaskedInput', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DatePicker placeholder="yyyy-mm-dd" onChange={onChange} />);

    const input = screen.getByPlaceholderText('yyyy-mm-dd');
    await user.type(input, '20260625');

    expect(input).toHaveValue('2026-06-25');
  });

  it('syncs calendar month with typed display when popover opens', async () => {
    const user = userEvent.setup();

    render(
      <DatePicker calendarProps={{ defaultMonth: new Date(2026, 0, 1) }} />
    );

    await user.type(screen.getByPlaceholderText('yyyy-mm-dd'), '20260615');
    await user.click(screen.getByRole('button', { name: 'Open calendar' }));

    expect(screen.getByText('2026.6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /june 15th, 2026/i })).toBeInTheDocument();
  });

  it('calls onChange when calendar day is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        onChange={onChange}
        calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    await user.click(screen.getByRole('button', { name: /june 15th, 2026/i }));

    expect(onChange).toHaveBeenCalled();
    const selected = onChange.mock.calls.at(-1)?.[0] as Date;
    expect(selected.getDate()).toBe(15);
  });

  it('clears value when clearable', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        clearable
        value={new Date(2026, 5, 25)}
        onChange={onChange}
      />
    );

    const input = screen.getByDisplayValue('2026-06-25');
    await user.click(input);
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});

describe('MonthPicker', () => {
  it('formats typed ym input via MaskedInput', async () => {
    const user = userEvent.setup();

    render(<MonthPicker placeholder="yyyy-mm" />);

    const input = screen.getByPlaceholderText('yyyy-mm');
    await user.type(input, '202606');

    expect(input).toHaveValue('2026-06');
  });

  it('selects month from grid', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<MonthPicker onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Open month picker' }));
    await user.click(screen.getByRole('button', { name: '6월' }));

    expect(onChange).toHaveBeenCalled();
    const selected = onChange.mock.calls.at(-1)?.[0] as Date;
    expect(selected.getMonth()).toBe(5);
    expect(selected.getDate()).toBe(1);
  });
});

describe('RangeDatePicker', () => {
  it('opens popover from calendar trigger', async () => {
    const user = userEvent.setup();

    render(<RangeDatePicker placeholder="Pick range" />);

    expect(screen.queryByRole('button', { name: 'Confirm range' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open range calendar' }));
    expect(screen.getByRole('button', { name: 'Confirm range' })).toBeInTheDocument();
  });
});
