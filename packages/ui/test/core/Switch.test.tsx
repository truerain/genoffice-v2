/**
 * @file packages/ui/test/core/Switch.test.tsx
 * @description Tests for Switch.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../../src/core/switch/Switch';
import styles from '../../src/core/switch/Switch.module.css';

describe('Switch', () => {
  it('renders with switch role', () => {
    render(<Switch aria-label="Airplane mode" />);
    expect(screen.getByRole('switch', { name: 'Airplane mode' })).toBeInTheDocument();
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Airplane mode" />);
    const switchControl = screen.getByRole('switch', { name: 'Airplane mode' });
    expect(switchControl).not.toBeChecked();
    await user.click(switchControl);
    expect(switchControl).toBeChecked();
  });

  it('respects disabled', () => {
    render(<Switch aria-label="Airplane mode" disabled defaultChecked />);
    const switchControl = screen.getByRole('switch', { name: 'Airplane mode' });
    expect(switchControl).toBeDisabled();
    expect(switchControl).toBeChecked();
  });

  it('applies error class when error', () => {
    render(<Switch aria-label="Airplane mode" error />);
    expect(screen.getByRole('switch', { name: 'Airplane mode' })).toHaveClass(styles.error);
  });
});
