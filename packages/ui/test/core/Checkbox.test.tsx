/**
 * @file packages/ui/test/core/Checkbox.test.tsx
 * @description Tests for Checkbox.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../../src/core/checkbox/Checkbox';
import styles from '../../src/core/checkbox/Checkbox.module.css';

describe('Checkbox', () => {
  it('renders with checkbox role', () => {
    render(<Checkbox aria-label="Agree" />);
    expect(screen.getByRole('checkbox', { name: 'Agree' })).toBeInTheDocument();
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Agree" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Agree' });
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('respects disabled', () => {
    render(<Checkbox aria-label="Agree" disabled defaultChecked />);
    const checkbox = screen.getByRole('checkbox', { name: 'Agree' });
    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeChecked();
  });

  it('applies error class when error', () => {
    render(<Checkbox aria-label="Agree" error />);
    expect(screen.getByRole('checkbox', { name: 'Agree' })).toHaveClass(styles.error);
  });
});
