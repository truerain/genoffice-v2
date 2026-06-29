/**
 * @file packages/gen-frame/src/url/useUrlSync.ts
 * @description Bidirectional URL ↔ active page sync (Gate F4).
 * @created 2026-06-29
 *
 * @remark
 * - Initial load + popstate → controller.open/activate
 * - activePageId change → history.pushState (or clear when no tab)
 *
 */

import { useCallback, useEffect, useRef } from 'react';
import type { UseUrlSyncOptions } from '../types';

export function useUrlSync({
  controller,
  adapter,
  activePageId,
  tabIds,
  resolvePayload,
  enabled = true,
}: UseUrlSyncOptions) {
  const applyingFromUrl = useRef(false);
  const initialSynced = useRef(false);

  const applyPageIdFromUrl = useCallback(
    (url?: string | URL) => {
      if (typeof window === 'undefined') return;

      const pageId = adapter.getPageIdFromUrl(url ?? window.location.href);
      if (!pageId) return;

      applyingFromUrl.current = true;
      try {
        if (tabIds.includes(pageId)) {
          controller.activate(pageId);
          return;
        }

        const payload = resolvePayload?.(pageId);
        if (payload) {
          controller.open(payload);
        }
      } finally {
        applyingFromUrl.current = false;
      }
    },
    [adapter, controller, resolvePayload, tabIds],
  );

  useEffect(() => {
    if (!enabled || initialSynced.current) return;
    initialSynced.current = true;
    applyPageIdFromUrl();
  }, [applyPageIdFromUrl, enabled]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const onPopState = () => {
      applyPageIdFromUrl();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [applyPageIdFromUrl, enabled]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || applyingFromUrl.current) return;

    if (!activePageId) {
      const cleared = adapter.clearUrl();
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (cleared !== current) {
        window.history.replaceState(null, '', cleared);
      }
      return;
    }

    const nextUrl = adapter.buildUrl(activePageId);
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl === current) return;

    window.history.pushState({ genFrameTab: activePageId }, '', nextUrl);
  }, [activePageId, adapter, enabled]);
}
