/**
 * @file packages/gen-frame/test/url/useUrlSync.test.tsx
 * @description Tests for useUrlSync hook.
 * @created 2026-06-29
 */
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createQueryTabUrlSyncAdapter } from '../../src/url/createQueryTabUrlSyncAdapter';
import { useUrlSync } from '../../src/url/useUrlSync';
import type { NavigationController } from '../../src/types';

describe('useUrlSync', () => {
  const adapter = createQueryTabUrlSyncAdapter({ param: 'menu' });
  let pushState: ReturnType<typeof vi.fn>;
  let replaceState: ReturnType<typeof vi.fn>;
  let originalPushState: History['pushState'];
  let originalReplaceState: History['replaceState'];

  beforeEach(() => {
    originalPushState = window.history.pushState.bind(window.history);
    originalReplaceState = window.history.replaceState.bind(window.history);
    originalReplaceState(null, '', '/');

    pushState = vi.fn((state, title, url) => {
      originalPushState(state, title, String(url));
    });
    replaceState = vi.fn((state, title, url) => {
      originalReplaceState(state, title, String(url));
    });
    vi.spyOn(window.history, 'pushState').mockImplementation(pushState);
    vi.spyOn(window.history, 'replaceState').mockImplementation(replaceState);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createController() {
    const open = vi.fn(() => true);
    const activate = vi.fn();
    const controller: NavigationController = {
      open,
      activate,
      close: vi.fn(),
      closeAll: vi.fn(),
    };
    return { controller, open, activate };
  }

  it('opens page from initial url menu param (deep-link-only)', () => {
    originalReplaceState(null, '', '/?menu=demo-chart');
    const { controller, open } = createController();

    const { rerender } = renderHook(
      ({ activePageId, tabIds }: { activePageId: string | null; tabIds: string[] }) =>
        useUrlSync({
          controller,
          adapter,
          activePageId,
          tabIds,
          resolvePayload: (pageId) => ({
            pageId,
            title: 'Chart',
            meta: { componentName: 'ChartDemoPage' },
          }),
          enabled: true,
          persistence: 'deep-link-only',
        }),
      { initialProps: { activePageId: null as string | null, tabIds: [] as string[] } },
    );

    expect(open).toHaveBeenCalledWith(
      expect.objectContaining({ pageId: 'demo-chart', title: 'Chart' }),
    );
    expect(replaceState).not.toHaveBeenCalled();

    rerender({ activePageId: 'demo-chart', tabIds: ['demo-chart'] });

    expect(replaceState).toHaveBeenCalledWith(null, '', '/');
    expect(pushState).not.toHaveBeenCalled();
  });

  it('clears url after deep-linked tab becomes active', () => {
    const { controller } = createController();

    const { rerender } = renderHook(
      ({ activePageId, tabIds }: { activePageId: string | null; tabIds: string[] }) =>
        useUrlSync({
          controller,
          adapter,
          activePageId,
          tabIds,
          enabled: true,
          persistence: 'deep-link-only',
        }),
      { initialProps: { activePageId: null as string | null, tabIds: [] as string[] } },
    );

    originalReplaceState(null, '', '/?menu=dashboard');
    replaceState.mockClear();

    rerender({ activePageId: 'dashboard', tabIds: ['dashboard'] });

    expect(replaceState).toHaveBeenCalledWith(null, '', '/');
    expect(pushState).not.toHaveBeenCalled();
  });

  it('keeps url in sync when persistence is persist', () => {
    const { controller } = createController();

    const { rerender } = renderHook(
      ({ activePageId, tabIds }: { activePageId: string | null; tabIds: string[] }) =>
        useUrlSync({
          controller,
          adapter,
          activePageId,
          tabIds,
          enabled: true,
          persistence: 'persist',
        }),
      { initialProps: { activePageId: 'home' as string | null, tabIds: ['home'] } },
    );

    replaceState.mockClear();

    rerender({ activePageId: 'dashboard', tabIds: ['home', 'dashboard'] });

    expect(replaceState).toHaveBeenCalledWith(
      { genFramePage: 'dashboard' },
      '',
      '/?menu=dashboard',
    );
    expect(pushState).not.toHaveBeenCalled();
  });
});
