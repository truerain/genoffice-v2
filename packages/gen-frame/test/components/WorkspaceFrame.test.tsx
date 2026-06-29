/**
 * @file packages/gen-frame/test/components/WorkspaceFrame.test.tsx
 * @description Smoke tests for WorkspaceFrame component.
 * @created 2026-06-29
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WorkspaceFrame } from '../../src/components/WorkspaceFrame/WorkspaceFrame';
import type { FrameMenuItem } from '../../src/types';

const menuItems: FrameMenuItem[] = [{ id: 'page-1', label: 'Page One' }];

describe('WorkspaceFrame', () => {
  it('renders header, navigation, and workarea', () => {
    render(
      <div style={{ height: 400, display: 'flex' }}>
        <WorkspaceFrame
          header={<span>Brand</span>}
          menu={{ items: menuItems }}
          menuTitle="Nav"
          workarea={<p>Work content</p>}
        />
      </div>,
    );

    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('Work content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page One' })).toBeInTheDocument();
  });

  it('forwards menu selection to onMenuSelect', async () => {
    const user = userEvent.setup();
    const onMenuSelect = vi.fn();

    render(
      <div style={{ height: 400, display: 'flex' }}>
        <WorkspaceFrame
          menu={{ items: menuItems }}
          onMenuSelect={onMenuSelect}
          workarea={<div>Body</div>}
        />
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Page One' }));
    expect(onMenuSelect).toHaveBeenCalledWith(menuItems[0]);
  });

  it('exposes layout data attribute on root', () => {
    const { container } = render(
      <div style={{ height: 400, display: 'flex' }}>
        <WorkspaceFrame layout="leftPanel" workarea={<div>Body</div>} />
      </div>,
    );

    const root = container.querySelector('[data-gen-frame-root]');
    expect(root).toHaveAttribute('data-gen-frame-layout', 'leftPanel');
  });
});
