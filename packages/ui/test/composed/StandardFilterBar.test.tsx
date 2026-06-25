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
  { key: 'keyword', title: 'Keyword', type: 'search', placeholder: 'Type here', size: 'fill' },
  {
    key: 'status',
    title: 'Status',
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
});
