/**
 * @file packages/ui/test/core/Label.test.tsx
 * @description Tests for Label.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '../../src/core/label/Label';
import styles from '../../src/core/label/Label.module.css';

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows required asterisk when required', () => {
    render(<Label required>Email</Label>);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies error class when error', () => {
    render(<Label error>Email</Label>);
    expect(screen.getByText('Email')).toHaveClass(styles.error);
  });

  it('associates with control via htmlFor', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Label htmlFor="field-a">Field</Label>
        <input id="field-a" />
      </>
    );
    const input = screen.getByLabelText('Field');
    await user.click(screen.getByText('Field'));
    expect(input).toHaveFocus();
  });
});
