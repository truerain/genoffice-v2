/**
 * @file apps/demo/src/app/url/useDemoMenuDeepLink.ts
 * @description Address-bar `?menu=` — fixed home tab + target menu (full page load).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: useDemoMenuDeepLink
 * - Same as menu click for target; always opens home tab first on cold load
 *
 */

import { useEffect, useRef } from 'react';
import type { AppMenuItem } from '../menu/menu.types';
import { DEMO_HOME_PAGE_ID } from '../menu/demoPageIds';
import { findAppMenuItemByPageId } from '../menu/mapAppMenuToFrame';
import { clearDemoMenuFromUrl, readInitialDemoMenuPageId } from './demoUrlSync';

interface UseDemoMenuDeepLinkOptions {
  items: AppMenuItem[];
  isMenuReady: boolean;
  openMenuItem: (item: AppMenuItem) => void;
}

function resolveHomeItem(items: AppMenuItem[]): AppMenuItem | undefined {
  return findAppMenuItemByPageId(items, DEMO_HOME_PAGE_ID) ?? items[0];
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

    const home = resolveHomeItem(items);
    if (home) {
      openMenuItem(home);
    }

    const target = findAppMenuItemByPageId(items, pageId);
    if (target && target.pageId !== home?.pageId) {
      openMenuItem(target);
    }

    clearDemoMenuFromUrl();
    handledRef.current = true;
    pendingPageIdRef.current = null;
  }, [isMenuReady, items, openMenuItem]);
}
