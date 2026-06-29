/**
 * @file packages/gen-frame/test/url/useUrlSync.test.tsx
 * @description Tests for useUrlSync hook.
 * @created 2026-06-29
 */
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createQueryTabUrlSyncAdapter } from '../../src/url/createQueryTabUrlSyncAdapter';
import { useUrlSync } from '../../src/url/useUrlSync';
import type { NavigationController } from '../../src/types';

describe('useUrlSync', () => {
  const adapter = createQueryTabUrlSyncAdapter({ param: 'tab' });
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

  it('opens page from initial url tab param', () => {
    originalReplaceState(null, '', '/?tab=demo-chart');
    const { controller, open } = createController();

    renderHook(() =>
      useUrlSync({
        controller,
        adapter,
        activePageId: null,
        tabIds: [],
        resolvePayload: (pageId) => ({
          pageId,
          title: 'Chart',
          meta: { componentName: 'ChartDemoPage' },
        }),
        enabled: true,
      }),
    );

    expect(open).toHaveBeenCalledWith(
      expect.objectContaining({ pageId: 'demo-chart', title: 'Chart' }),
    );
  });

  it('pushes url when activePageId changes', () => {
    const { controller } = createController();

    const { rerender } = renderHook(
      ({ activePageId }: { activePageId: string | null }) =>
        useUrlSync({
          controller,
          adapter,
          activePageId,
          tabIds: activePageId ? [activePageId] : [],
          enabled: true,
        }),
      { initialProps: { activePageId: null as string | null } },
    );

    rerender({ activePageId: 'dashboard' });

    expect(pushState).toHaveBeenCalledWith(
      { genFrameTab: 'dashboard' },
      '',
      '/?tab=dashboard',
    );
  });

  it('activates tab on popstate', () => {
    const { controller, activate } = createController();

    renderHook(() =>
      useUrlSync({
        controller,
        adapter,
        activePageId: 'home',
        tabIds: ['home', 'dashboard'],
        enabled: true,
      }),
    );

    act(() => {
      originalReplaceState(null, '', '/?tab=dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(activate).toHaveBeenCalledWith('dashboard');
  });
});
