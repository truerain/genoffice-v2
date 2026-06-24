/**
 * @file packages/ui/test/core/Breadcrumb.test.tsx
 * @description Tests for Breadcrumb navigation trail.
 * @created 2026-06-24
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Breadcrumb } from '../../src/core/breadcrumb/Breadcrumb';

describe('Breadcrumb', () => {
  it('renders navigation with items', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Laptop' },
        ]}
      />
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Laptop' })).not.toBeInTheDocument();
  });

  it('calls onClick for button items', async () => {
    const user = userEvent.setup();
    const onHome = vi.fn();

    render(
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onHome },
          { label: 'Current' },
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Home' }));
    expect(onHome).toHaveBeenCalledTimes(1);
  });

  it('collapses items when maxItems is exceeded', () => {
    render(
      <Breadcrumb
        maxItems={3}
        items={[
          { label: 'Home', href: '/' },
          { label: 'Level 1', href: '/l1' },
          { label: 'Level 2', href: '/l2' },
          { label: 'Current' },
        ]}
      />
    );

    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Level 1' })).not.toBeInTheDocument();
  });
});
