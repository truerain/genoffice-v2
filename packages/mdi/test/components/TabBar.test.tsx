/**
 * @file packages/mdi/test/components/TabBar.test.tsx
 * @description TabBar keyboard navigation and i18n labels tests.
 * @created 2026-06-27
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TabBar } from '../../src/components/TabBar/TabBar';
import { useMDIStore } from '../../src/store/mdiStore';
import * as tabScroll from '../../src/utils/tabScroll';

describe('TabBar', () => {
  it('syncs tab bar scroll when navigating with ArrowRight', async () => {
    const scrollSpy = vi.spyOn(tabScroll, 'syncTabBarScrollToActiveTab');
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });

    const user = userEvent.setup();
    for (let i = 0; i < 4; i += 1) {
      useMDIStore.getState().addTab({ id: `t${i}`, title: `Tab ${i}`, content: null });
    }
    useMDIStore.getState().setActiveTab('t0');

    render(<TabBar position="top" />);

    const tab0 = screen.getByRole('tab', { name: /Tab 0/i });
    tab0.focus();
    scrollSpy.mockClear();
    await user.keyboard('{ArrowRight}');
    rafCallbacks.forEach((callback) => callback(0));

    expect(useMDIStore.getState().activeTabId).toBe('t1');
    expect(scrollSpy).toHaveBeenCalledWith('t1', expect.any(HTMLElement));

    scrollSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it('activates next tab on ArrowRight', async () => {
    const user = userEvent.setup();
    useMDIStore.getState().addTab({ id: 'a', title: 'Tab A', content: null });
    useMDIStore.getState().addTab({ id: 'b', title: 'Tab B', content: null });

    render(<TabBar position="top" />);

    const tabA = screen.getByRole('tab', { name: /Tab A/i });
    tabA.focus();
    await user.keyboard('{ArrowRight}');

    expect(useMDIStore.getState().activeTabId).toBe('b');
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: /Tab B/i }));
    });
  });

  it('activates first tab on Home from last tab', async () => {
    const user = userEvent.setup();
    useMDIStore.getState().addTab({ id: 'a', title: 'Tab A', content: null });
    useMDIStore.getState().addTab({ id: 'b', title: 'Tab B', content: null });

    render(<TabBar position="top" />);

    const tabB = screen.getByRole('tab', { name: /Tab B/i });
    tabB.focus();
    await user.keyboard('{Home}');

    expect(useMDIStore.getState().activeTabId).toBe('a');
  });

  it('renders custom context menu labels', () => {
    useMDIStore.getState().addTab({ id: 'a', title: 'Tab A', content: null });

    render(<TabBar position="top" labels={{ close: '닫기', closeOthers: '다른 탭 닫기', closeAll: '모두 닫기' }} />);

    fireEvent.contextMenu(screen.getByRole('tab', { name: /Tab A/i }), { clientX: 100, clientY: 50 });

    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다른 탭 닫기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '모두 닫기' })).toBeInTheDocument();
    expect(screen.getByRole('menu')).toHaveStyle({ left: '100px', top: '50px' });
  });

  it('moves focus to active tab after closing the active tab', async () => {
    const user = userEvent.setup();
    useMDIStore.getState().addTab({ id: 'a', title: 'Tab A', content: null });
    useMDIStore.getState().addTab({ id: 'b', title: 'Tab B', content: null });
    useMDIStore.getState().setActiveTab('a');

    render(<TabBar position="top" />);

    await user.click(screen.getByRole('button', { name: /Close Tab A/i }));

    expect(useMDIStore.getState().activeTabId).toBe('b');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: /Tab B/i }));
  });

  it('syncs tab bar scroll when clicking active tab again', () => {
    const scrollSpy = vi.spyOn(tabScroll, 'syncTabBarScrollToActiveTab');

    useMDIStore.getState().addTab({ id: 'a', title: 'Tab A', content: null });
    useMDIStore.getState().setActiveTab('a');

    render(<TabBar position="top" />);

    scrollSpy.mockClear();
    fireEvent.click(screen.getByRole('tab', { name: /Tab A/i }));

    expect(scrollSpy).toHaveBeenCalledWith('a', expect.any(HTMLElement));

    scrollSpy.mockRestore();
  });

  it('does not render close button for closable:false tabs', () => {
    useMDIStore.getState().addTab({
      id: 'pin',
      title: 'Pinned',
      closable: false,
      content: null,
    });
    useMDIStore.getState().addTab({ id: 'a', title: 'Tab A', content: null });

    render(<TabBar position="top" />);

    expect(screen.queryByRole('button', { name: /Close Pinned/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close Tab A/i })).toBeInTheDocument();
  });

  it('selects tab on click without programmatic focus (prevents scroll jump)', () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    useMDIStore.getState().addTab({ id: 'a', title: 'Tab A', content: null });
    useMDIStore.getState().addTab({ id: 'b', title: 'Tab B', content: null });
    useMDIStore.getState().setActiveTab('a');

    render(<TabBar position="top" />);

    fireEvent.click(screen.getByRole('tab', { name: /Tab B/i }));

    expect(useMDIStore.getState().activeTabId).toBe('b');
    expect(focusSpy).not.toHaveBeenCalled();
    focusSpy.mockRestore();
  });
});
