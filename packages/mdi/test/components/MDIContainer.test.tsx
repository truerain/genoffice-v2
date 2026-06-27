/**
 * @file packages/mdi/test/components/MDIContainer.test.tsx
 * @description Smoke tests for MDIContainer.
 * @created 2026-06-27
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MDIContainer } from '../../src/components/MDIContainer/MDIContainer';
import { useMDIStore } from '../../src/store/mdiStore';

describe('MDIContainer', () => {
  it('renders empty state when no tabs are open', () => {
    render(<MDIContainer emptyContent={<p>Empty MDI</p>} />);
    expect(screen.getByText('Empty MDI')).toBeInTheDocument();
  });

  it('renders default empty message', () => {
    render(<MDIContainer />);
    expect(screen.getByText('No tabs open')).toBeInTheDocument();
  });

  it('renders tab bar and active panel content', () => {
    useMDIStore.getState().addTab({
      id: 'page-1',
      title: 'Page One',
      content: <span>Panel body</span>,
    });

    render(<MDIContainer />);

    expect(screen.getByRole('tab', { name: /Page One/i })).toBeInTheDocument();
    expect(screen.getByText('Panel body')).toBeVisible();
  });

  it('syncs maxTabs prop to the store', () => {
    render(<MDIContainer maxTabs={7} />);
    expect(useMDIStore.getState().maxTabs).toBe(7);
  });

  it('syncs tabPosition prop to the store', () => {
    render(<MDIContainer tabPosition="bottom" />);
    expect(useMDIStore.getState().tabPosition).toBe('bottom');
  });

  it('registers onMaxTabsReached from props and invokes on limit', () => {
    const onMaxTabsReached = vi.fn();
    render(<MDIContainer maxTabs={1} onMaxTabsReached={onMaxTabsReached} />);

    useMDIStore.getState().addTab({ id: 'a', title: 'A', content: null });
    useMDIStore.getState().addTab({ id: 'b', title: 'B', content: null });

    expect(onMaxTabsReached).toHaveBeenCalledTimes(1);
  });
});
