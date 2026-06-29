/**
 * @file packages/gen-frame/test/components/LeftPanelNav.test.tsx
 * @description Tests for LeftPanelNav component.
 * @created 2026-06-29
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LeftPanelNav } from '../../src/components/LeftPanelNav/LeftPanelNav';
import type { FrameMenuItem } from '../../src/types';

const items: FrameMenuItem[] = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
];

describe('LeftPanelNav', () => {
  it('renders menu items', () => {
    render(<LeftPanelNav items={items} title="Menu" ariaLabel="Main" />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Beta' })).toBeInTheDocument();
  });

  it('calls onSelect when an item is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<LeftPanelNav items={items} onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Beta' }));
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });

  it('marks active item with aria-current', () => {
    render(<LeftPanelNav items={items} activeId="a" />);
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Beta' })).not.toHaveAttribute('aria-current');
  });
});
