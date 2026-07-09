/**
 * @file apps/demo/src/app/mdi/useDevMdiTabPersistence.ts
 * @description Restore MDI tabs from sessionStorage after Vite full page reload (dev only).
 * @created 2026-07-09
 *
 * @remark
 * - Exports: useDevMdiTabPersistence
 * - 프로덕션(`import.meta.env.PROD`)에서는 no-op
 *
 * @history
 * - 2026-07-09 신규
 */

import { useEffect, useRef } from 'react';
import { useMDIStore } from '@gen-office/mdi';
import type { NavigationController } from '@gen-office/gen-frame';
import { isComponentName } from '../config/componentRegistry';
import {
  readDevMdiTabState,
  tabToPersisted,
  writeDevMdiTabState,
} from './demoMdiDevPersistence';

interface UseDevMdiTabPersistenceOptions {
  enabled?: boolean;
  isMenuReady: boolean;
  controller: NavigationController;
  pinnedPageIds: ReadonlySet<string>;
}

export function useDevMdiTabPersistence({
  enabled = import.meta.env.DEV,
  isMenuReady,
  controller,
  pinnedPageIds,
}: UseDevMdiTabPersistenceOptions): void {
  const restoredRef = useRef(false);
  const tabCount = useMDIStore((state) => state.tabs.length);

  useEffect(() => {
    if (!enabled || !isMenuReady || restoredRef.current || tabCount === 0) {
      return;
    }

    restoredRef.current = true;

    const saved = readDevMdiTabState();
    if (!saved?.tabs.length) {
      return;
    }

    const openIds = new Set(useMDIStore.getState().tabs.map((tab) => tab.id));

    for (const tab of saved.tabs) {
      if (openIds.has(tab.id) || pinnedPageIds.has(tab.id)) {
        continue;
      }

      if (!isComponentName(tab.componentName)) {
        continue;
      }

      controller.open({
        pageId: tab.id,
        title: tab.title,
        params: tab.params,
        meta: { componentName: tab.componentName },
      });
    }

    const activeId = saved.activeTabId;
    if (activeId && useMDIStore.getState().tabs.some((tab) => tab.id === activeId)) {
      useMDIStore.getState().setActiveTab(activeId);
    }
  }, [controller, enabled, isMenuReady, pinnedPageIds, tabCount]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    return useMDIStore.subscribe((state, prevState) => {
      if (state.tabs === prevState.tabs && state.activeTabId === prevState.activeTabId) {
        return;
      }

      const tabs = state.tabs
        .map(tabToPersisted)
        .filter((tab): tab is NonNullable<typeof tab> => tab !== null);

      writeDevMdiTabState({
        tabs,
        activeTabId: state.activeTabId,
      });
    });
  }, [enabled]);
}
