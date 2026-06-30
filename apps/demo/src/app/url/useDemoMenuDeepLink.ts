/**
 * @file apps/demo/src/app/url/useDemoMenuDeepLink.ts
 * @description Address-bar `?menu=` — open target page on cold load (Welcome pin is separate).
 * @created 2026-06-29
 * @updated 2026-06-29
 *
 * @remark
 * - Exports: useDemoMenuDeepLink
 * - Welcome pin: AppShell `pinnedPages` → useOpenPage (runs before this effect)
 *
 * @history
 * - 2026-06-29 Welcome pin — no longer opens home tab here
 */

import { useEffect, useRef } from 'react';
import { useMDIStore } from '@gen-office/mdi';
import type { AppMenuItem } from '../menu/menu.types';
import { DEMO_HOME_PAGE_ID } from '../menu/demoPageIds';
import { findAppMenuItemByPageId } from '../menu/mapAppMenuToFrame';
import { clearDemoMenuFromUrl, readInitialDemoMenuPageId } from './demoUrlSync';

interface UseDemoMenuDeepLinkOptions {
  items: AppMenuItem[];
  isMenuReady: boolean;
  openMenuItem: (item: AppMenuItem) => void;
}

export function useDemoMenuDeepLink({
  items,
  isMenuReady,
  openMenuItem,
}: UseDemoMenuDeepLinkOptions) {
  const pendingPageIdRef = useRef(readInitialDemoMenuPageId());
  const handledRef = useRef(false);

  useEffect(() => {
    if (!isMenuReady || handledRef.current) return;

    const pageId = pendingPageIdRef.current;
    if (!pageId) return;

    const target = findAppMenuItemByPageId(items, pageId);
    if (target && target.pageId !== DEMO_HOME_PAGE_ID) {
      openMenuItem(target);
    } else if (target) {
      useMDIStore.getState().setActiveTab(DEMO_HOME_PAGE_ID);
    }

    clearDemoMenuFromUrl();
    handledRef.current = true;
    pendingPageIdRef.current = null;
  }, [isMenuReady, items, openMenuItem]);
}
