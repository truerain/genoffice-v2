/**
 * @file packages/ui/test/composed/StandardFilterBar.test.tsx
 * @description Tests for StandardFilterBar.
 * @created 2026-06-25
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StandardFilterBar } from '../../src/composed/filterBar';
import type { FilterField } from '../../src/composed/filterBar';

type Filters = { keyword: string; status: string };

const fields: FilterField<Filters>[] = [
  { key: 'keyword', label: 'Keyword', type: 'search', placeholder: 'Type here', size: 'fill' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Pick',
    options: [{ label: 'Active', value: 'A' }],
    size: 'sm',
  },
];

describe('StandardFilterBar', () => {
  it('renders fields and triggers onSearch from action button', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onChange = vi.fn();

    render(
      <StandardFilterBar
        value={{ keyword: '', status: '' }}
        fields={fields}
        onChange={onChange}
        onSearch={onSearch}
        searchLabel="검색"
      />
    );

    expect(screen.getByText('Keyword')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '검색' }));
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when typing in search field', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <StandardFilterBar
        value={{ keyword: '', status: '' }}
        fields={fields}
        onChange={onChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Type here');
    await user.type(searchInput, 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('respects clearable=false on text fields', () => {
    render(
      <StandardFilterBar
        value={{ keyword: 'filled', status: '' }}
        fields={[
          {
            key: 'keyword',
            label: 'Keyword',
            type: 'text',
            clearable: false,
          },
        ]}
        onChange={vi.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('uses clearLabel on text fields', () => {
    render(
      <StandardFilterBar
        value={{ keyword: 'filled', status: '' }}
        fields={[
          {
            key: 'keyword',
            label: 'Keyword',
            type: 'text',
            clearLabel: '지우기',
          },
        ]}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: '지우기' })).toBeInTheDocument();
  });

  it('triggers onSearch when pressing Enter on text field with enterToSearch', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <StandardFilterBar
        value={{ keyword: '', status: '' }}
        fields={[
          {
            key: 'keyword',
            label: 'Keyword',
            type: 'text',
            placeholder: 'Enter keyword',
            enterToSearch: true,
          },
        ]}
        onChange={vi.fn()}
        onSearch={onSearch}
      />
    );

    const input = screen.getByPlaceholderText('Enter keyword');
    await user.click(input);
    await user.keyboard('{Enter}');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('renders date and month fields', () => {
    render(
      <StandardFilterBar
        value={{ fromDate: new Date(2026, 5, 15), baseMonth: new Date(2026, 5, 1) }}
        fields={[
          {
            key: 'fromDate',
            label: 'From date',
            type: 'date',
            placeholder: 'yyyy-mm-dd',
            size: 'md',
          },
          {
            key: 'baseMonth',
            label: 'Base month',
            type: 'month',
            placeholder: 'yyyy-mm',
            size: 'sm',
          },
        ]}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('From date')).toBeInTheDocument();
    expect(screen.getByText('Base month')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-06-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-06')).toBeInTheDocument();
  });

  it('renders date-range and month-range fields', () => {
    render(
      <StandardFilterBar
        value={{
          period: { from: new Date(2026, 5, 1), to: new Date(2026, 5, 15) },
          monthPeriod: { from: new Date(2026, 2, 1), to: new Date(2026, 7, 1) },
        }}
        fields={[
          {
            key: 'period',
            label: 'Date range',
            type: 'date-range',
            size: 'lg',
          },
          {
            key: 'monthPeriod',
            label: 'Month range',
            type: 'month-range',
            size: 'lg',
          },
        ]}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText('Date range')).toBeInTheDocument();
    expect(screen.getByText('Month range')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/2026\. 06\. 01\. ~ 2026\. 06\. 15\./)).toBeInTheDocument();
  });

  it('calls onChange when date field is cleared', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <StandardFilterBar
        value={{ fromDate: new Date(2026, 5, 15) }}
        fields={[
          {
            key: 'fromDate',
            label: 'From date',
            type: 'date',
            clearable: true,
          },
        ]}
        onChange={onChange}
      />
    );

    const input = screen.getByDisplayValue('2026-06-15');
    await user.click(input);
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledWith({ fromDate: undefined });
  });

  it('toggles visible fields when collapsible', async () => {
    const user = userEvent.setup();

    render(
      <StandardFilterBar
        collapsible
        collapsedCount={2}
        value={{ keyword: '', status: '', extra: '' }}
        fields={[
          { key: 'keyword', label: 'Keyword', type: 'search', size: 'fill', simple: true },
          { key: 'status', label: 'Status', type: 'text', size: 'sm', simple: true },
          { key: 'extra', label: 'Extra', type: 'text', size: 'sm' },
        ]}
        onChange={vi.fn()}
        onSearch={vi.fn()}
      />
    );

    expect(screen.getByText('Keyword')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.queryByText('Extra')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '상세' }));
    expect(screen.getByText('Extra')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '간단히' }));
    expect(screen.queryByText('Extra')).not.toBeInTheDocument();
  });
});
