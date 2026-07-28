/**
 * @file packages/ui/test/composed/DatePicker.test.tsx
 * @description Tests for DatePicker composed family (C5b + Multi).
 * @created 2026-06-25
 * @updated 2026-07-29
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '../../src/composed/datePicker/DatePicker';
import { MonthPicker } from '../../src/composed/datePicker/MonthPicker';
import { MultiDatePicker } from '../../src/composed/datePicker/MultiDatePicker';
import { MultiMonthPicker } from '../../src/composed/datePicker/MultiMonthPicker';
import { RangeDatePicker } from '../../src/composed/datePicker/RangeDatePicker';
import {
  dayKey,
  normalizeDates,
  normalizeMonths,
} from '../../src/composed/datePicker/datePickerUtils';
import { formatMultiSelectionDisplay } from '../../src/composed/datePicker/multiSelectionDisplay';

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

    // Controlled month starts as today; type ymd so open syncs calendar to June.
    await user.type(screen.getByPlaceholderText('yyyy-mm-dd'), '20260601');
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

describe('multiSelectionDisplay / normalize', () => {
  it('dedupes and sorts dates', () => {
    const a = new Date(2026, 5, 15, 12);
    const b = new Date(2026, 5, 1);
    const c = new Date(2026, 5, 15, 18);
    const next = normalizeDates([a, b, c]);
    expect(next.map(dayKey)).toEqual([20260601, 20260615]);
  });

  it('dedupes months to day=1', () => {
    const next = normalizeMonths([new Date(2026, 5, 20), new Date(2026, 0, 5), new Date(2026, 5, 1)]);
    expect(next.map((d) => [d.getFullYear(), d.getMonth(), d.getDate()])).toEqual([
      [2026, 0, 1],
      [2026, 5, 1],
    ]);
  });

  it('summarizes overflow labels', () => {
    const items = [new Date(2026, 0, 1), new Date(2026, 1, 1), new Date(2026, 2, 1)];
    const { label, title } = formatMultiSelectionDisplay(items, {
      summaryThreshold: 2,
      formatItem: (d) => `${d.getFullYear()}-${d.getMonth() + 1}`,
    });
    expect(label).toBe('2026-1 +2 more');
    expect(title).toBe('2026-1, 2026-2, 2026-3');
  });
});

describe('MultiDatePicker', () => {
  it('opens popover and confirms selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MultiDatePicker
        placeholder="Pick dates"
        onChange={onChange}
        calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open multi date picker' }));
    await user.click(screen.getByRole('button', { name: /june 10th, 2026/i }));
    await user.click(screen.getByRole('button', { name: 'Confirm dates' }));

    expect(onChange).toHaveBeenCalled();
    const selected = onChange.mock.calls.at(-1)?.[0] as Date[];
    expect(selected).toHaveLength(1);
    expect(selected[0].getDate()).toBe(10);
  });

  it('clears draft then commits undefined', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MultiDatePicker
        clearable
        value={[new Date(2026, 5, 1)]}
        onChange={onChange}
        calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open multi date picker' }));
    await user.click(screen.getByRole('button', { name: 'Clear dates' }));
    await user.click(screen.getByRole('button', { name: 'Confirm dates' }));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});

describe('MultiMonthPicker', () => {
  it('toggles months and confirms', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<MultiMonthPicker placeholder="Pick months" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Open multi month picker' }));
    await user.click(screen.getByRole('button', { name: '3월' }));
    await user.click(screen.getByRole('button', { name: '6월' }));
    await user.click(screen.getByRole('button', { name: 'Confirm months' }));

    expect(onChange).toHaveBeenCalled();
    const selected = onChange.mock.calls.at(-1)?.[0] as Date[];
    expect(selected.map((d) => d.getMonth())).toEqual([2, 5]);
  });
});
