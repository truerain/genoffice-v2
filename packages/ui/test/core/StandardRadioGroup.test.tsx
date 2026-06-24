/**
 * @file packages/ui/test/core/StandardRadioGroup.test.tsx
 * @description Tests for StandardRadioGroup.
 * @created 2026-06-24
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StandardRadioGroup } from '../../src/core/radio/StandardRadioGroup';

describe('StandardRadioGroup', () => {
  it('renders options as radios with labels', () => {
    render(
      <StandardRadioGroup
        options={[
          { value: '1', label: 'One' },
          { value: '2', label: 'Two' },
        ]}
      />
    );
    expect(screen.getByRole('radio', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Two' })).toBeInTheDocument();
  });

  it('selects option on click', async () => {
    const user = userEvent.setup();
    render(
      <StandardRadioGroup
        options={[
          { value: '1', label: 'One' },
          { value: '2', label: 'Two' },
        ]}
      />
    );
    await user.click(screen.getByRole('radio', { name: 'Two' }));
    expect(screen.getByRole('radio', { name: 'Two' })).toBeChecked();
  });
});
