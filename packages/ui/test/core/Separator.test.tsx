/**
 * @file packages/ui/test/core/Separator.test.tsx
 * @description Tests for Separator.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Separator } from '../../src/core/separator/Separator';
import styles from '../../src/core/separator/Separator.module.css';

describe('Separator', () => {
  it('is decorative by default (no separator role)', () => {
    render(<Separator data-testid="sep" />);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getByTestId('sep')).toBeInTheDocument();
  });

  it('exposes separator role when not decorative', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('sets vertical aria-orientation', () => {
    render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies variant class', () => {
    render(<Separator variant="strong" data-testid="sep" />);
    expect(screen.getByTestId('sep')).toHaveClass(styles.strong);
  });
});
