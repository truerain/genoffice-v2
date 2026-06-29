/**
 * @file packages/gen-frame/test/components/TitleBarNav.test.tsx
 * @description Tests for TitleBarNav component.
 * @created 2026-06-29
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TitleBarNav } from '../../src/components/TitleBarNav/TitleBarNav';
import type { FrameMenuItem } from '../../src/types';

const items: FrameMenuItem[] = [
  { id: 'home', label: 'Home' },
  {
    id: 'admin',
    label: 'Admin',
    children: [{ id: 'users', label: 'Users' }],
  },
];

describe('TitleBarNav', () => {
  it('renders top-level items', () => {
    render(<TitleBarNav items={items} ariaLabel="Top nav" />);
    expect(screen.getByRole('navigation', { name: 'Top nav' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Admin/i })).toBeInTheDocument();
  });

  it('calls onSelect for leaf item click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<TitleBarNav items={items} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Home' }));
    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });
});
