/**
 * @file packages/ui/test/core/Radio.test.tsx
 * @description Tests for RadioGroup and Radio.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, Radio } from '../../src/core/radio/Radio';
import styles from '../../src/core/radio/Radio.module.css';

describe('Radio', () => {
  it('renders radio group with options', () => {
    render(
      <RadioGroup>
        <Radio value="a" aria-label="Option A" />
        <Radio value="b" aria-label="Option B" />
      </RadioGroup>
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Option A' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeInTheDocument();
  });

  it('selects option on click', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup>
        <Radio value="a" aria-label="Option A" />
        <Radio value="b" aria-label="Option B" />
      </RadioGroup>
    );
    await user.click(screen.getByRole('radio', { name: 'Option B' }));
    expect(screen.getByRole('radio', { name: 'Option B' })).toBeChecked();
  });

  it('applies error class when error', () => {
    render(
      <RadioGroup>
        <Radio value="a" aria-label="Option A" error />
      </RadioGroup>
    );
    expect(screen.getByRole('radio', { name: 'Option A' })).toHaveClass(styles.error);
  });
});
