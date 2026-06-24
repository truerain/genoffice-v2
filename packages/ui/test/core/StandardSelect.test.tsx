/**
 * @file packages/ui/test/core/StandardSelect.test.tsx
 * @description Tests for StandardSelect.
 * @created 2026-06-24
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StandardSelect } from '../../src/core/select/StandardSelect';

describe('StandardSelect', () => {
  it('renders combobox trigger with placeholder', () => {
    render(
      <StandardSelect
        placeholder="Choose country"
        options={[
          { value: 'kr', label: 'South Korea' },
          { value: 'jp', label: 'Japan' },
        ]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Choose country')).toBeInTheDocument();
  });

  it('renders with grouped options without error', () => {
    render(
      <StandardSelect
        groups={[
          {
            label: 'Asia',
            options: [{ value: 'jp', label: 'Japan' }],
          },
        ]}
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
