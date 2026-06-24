/**
 * @file packages/ui/test/core/Drawer.test.tsx
 * @description Tests for Drawer slide-over panel.
 * @created 2026-06-24
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer } from '../../src/core/drawer/Drawer';

describe('Drawer', () => {
  it('renders dialog when open', () => {
    render(
      <Drawer open onOpenChange={() => {}} title="Panel">
        Body content
      </Drawer>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Panel')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Drawer open={false} onOpenChange={() => {}} title="Hidden">
        Hidden body
      </Drawer>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onOpenChange(false) on Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Drawer open onOpenChange={onOpenChange} title="Panel">
        Body
      </Drawer>
    );

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(false) on overlay click by default', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Drawer open onOpenChange={onOpenChange} title="Panel">
        Body
      </Drawer>
    );

    await user.click(screen.getByTestId('drawer-overlay'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close on overlay click when closeOnOverlayClick is false', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Drawer open onOpenChange={onOpenChange} title="Panel" closeOnOverlayClick={false}>
        Body
      </Drawer>
    );

    await user.click(screen.getByTestId('drawer-overlay'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes via header close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Drawer open onOpenChange={onOpenChange} title="Panel">
        Body
      </Drawer>
    );

    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
