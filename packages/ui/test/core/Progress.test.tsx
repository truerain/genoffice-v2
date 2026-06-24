/**
 * @file packages/ui/test/core/Progress.test.tsx
 * @description Tests for Progress bar.
 * @created 2026-06-24
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from '../../src/core/progress/Progress';

describe('Progress', () => {
  it('renders determinate progress with value', () => {
    render(<Progress value={42} aria-label="Upload progress" />);

    const bar = screen.getByRole('progressbar', { name: 'Upload progress' });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute('aria-valuenow', '42');
  });

  it('renders indeterminate progress when value is null', () => {
    render(<Progress value={null} aria-label="Loading" />);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
  });
});
