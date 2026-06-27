/**
 * @file packages/mdi/test/components/TabBar.test.tsx
 * @description TabBar keyboard navigation and i18n labels tests.
 * @created 2026-06-27
 */
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TabBar } from '../../src/components/TabBar/TabBar';
import { useMDIStore } from '../../src/store/mdiStore';

describe('TabBar', () => {
  it('activates next tab on ArrowRight', async () => {
    const user = userEvent.setup();
    useMDIStore.getState().addTab({ id: 'a', title: 'Tab A', content: null });
    useMDIStore.getState().addTab({ id: 'b', title: 'Tab B', content: null });

    render(<TabBar position="top" />);

    const tabA = screen.getByRole('tab', { name: /Tab A/i });
    tabA.focus();
    await user.keyboard('{ArrowRight}');

    expect(useMDIStore.getState().activeTabId).toBe('b');
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: /Tab B/i }));
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

    fireEvent.contextMenu(screen.getByRole('tab', { name: /Tab A/i }));

    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다른 탭 닫기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '모두 닫기' })).toBeInTheDocument();
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
});
