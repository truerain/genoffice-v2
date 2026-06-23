/**
 * @file packages/ui/test/core/Badge.test.tsx
 * @description Tests for Badge.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../src/core/badge/Badge';
import styles from '../../src/core/badge/Badge.module.css';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders dot indicator when dot is true', () => {
    render(<Badge dot>Active</Badge>);
    const badge = screen.getByText('Active').parentElement;
    expect(badge?.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('applies variant and size classes', () => {
    render(
      <Badge variant="success" size="sm" data-testid="badge">
        OK
      </Badge>
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass(styles.success);
    expect(badge).toHaveClass(styles.sm);
  });
});
