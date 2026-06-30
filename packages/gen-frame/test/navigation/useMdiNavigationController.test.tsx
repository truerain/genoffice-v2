/**
 * @file packages/gen-frame/test/navigation/useMdiNavigationController.test.tsx
 * @description Tests for useMdiNavigationController pinnedPages.
 * @created 2026-06-29
 */
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useMDIStore } from '@gen-office/mdi';
import { useMdiNavigationController } from '../../src/navigation/useMdiNavigationController';

afterEach(() => {
  useMDIStore.getState().reset();
});

describe('useMdiNavigationController', () => {
  it('syncs pinnedPages on mount', async () => {
    renderHook(() =>
      useMdiNavigationController({
        resolveTab: (payload) => ({
          id: payload.pageId,
          title: payload.title,
          content: <span>pin</span>,
        }),
        pinnedPages: [{ pageId: 'home', title: 'Home' }],
      }),
    );

    await waitFor(() => {
      const { tabs } = useMDIStore.getState();
      expect(tabs).toHaveLength(1);
      expect(tabs[0]?.id).toBe('home');
      expect(tabs[0]?.closable).toBe(false);
    });
  });

  it('skips pinned sync when pinnedPagesEnabled is false', async () => {
    renderHook(() =>
      useMdiNavigationController({
        resolveTab: (payload) => ({
          id: payload.pageId,
          title: payload.title,
          content: null,
        }),
        pinnedPages: [{ pageId: 'home', title: 'Home' }],
        pinnedPagesEnabled: false,
      }),
    );

    await waitFor(() => {
      expect(useMDIStore.getState().tabs).toHaveLength(0);
    });
  });
});
