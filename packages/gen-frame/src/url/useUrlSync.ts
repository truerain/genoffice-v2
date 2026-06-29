/**
 * @file packages/gen-frame/src/url/useUrlSync.ts
 * @description URL ↔ page sync — deep-link or persist (Gate F4).
 * @created 2026-06-29
 * @updated 2026-06-29
 *
 * @remark
 * - `deep-link-only`: read query on load, then clear URL (MDI)
 * - `persist`: keep query in sync with active page (single)
 *
 * @history
 * - 2026-06-29 persistence modes; drop bidirectional pushState stack
 */

import { useCallback, useEffect, useRef } from 'react';
import type { UseUrlSyncOptions } from '../types';

function readCurrentUrl(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function clearUrlInHistory(adapter: UseUrlSyncOptions['adapter']) {
  const cleared = adapter.clearUrl();
  const current = readCurrentUrl();
  if (cleared !== current) {
    window.history.replaceState(null, '', cleared);
  }
}

export function useUrlSync({
  controller,
  adapter,
  activePageId,
  tabIds,
  resolvePayload,
  enabled = true,
  persistence = 'deep-link-only',
}: UseUrlSyncOptions) {
  const initialSynced = useRef(false);
  const consumedDeepLink = useRef(false);

  const applyPageIdFromUrl = useCallback(
    (url?: string | URL) => {
      if (typeof window === 'undefined') return;

      const pageId = adapter.getPageIdFromUrl(url ?? window.location.href);
      if (!pageId) return;

      if (tabIds.includes(pageId)) {
        controller.activate(pageId);
      } else {
        const payload = resolvePayload?.(pageId);
        if (payload) {
          controller.open(payload);
        }
      }

      if (persistence === 'deep-link-only') {
        consumedDeepLink.current = true;
        clearUrlInHistory(adapter);
      }
    },
    [adapter, controller, persistence, resolvePayload, tabIds],
  );

  useEffect(() => {
    if (!enabled || initialSynced.current) return;
    initialSynced.current = true;
    applyPageIdFromUrl();
  }, [applyPageIdFromUrl, enabled]);

  useEffect(() => {
    if (!enabled || persistence !== 'persist' || typeof window === 'undefined') return;

    const onPopState = () => {
      applyPageIdFromUrl();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [applyPageIdFromUrl, enabled, persistence]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    if (persistence === 'persist') {
      if (!activePageId) {
        clearUrlInHistory(adapter);
        return;
      }

      const nextUrl = adapter.buildUrl(activePageId);
      if (nextUrl === readCurrentUrl()) return;

      window.history.replaceState({ genFramePage: activePageId }, '', nextUrl);
      return;
    }

    if (!activePageId) {
      clearUrlInHistory(adapter);
      return;
    }

    if (consumedDeepLink.current || adapter.getPageIdFromUrl(window.location.href)) {
      clearUrlInHistory(adapter);
      consumedDeepLink.current = false;
    }
  }, [activePageId, adapter, enabled, persistence]);
}
