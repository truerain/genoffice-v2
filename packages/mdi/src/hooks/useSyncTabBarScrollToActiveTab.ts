/**
 * @file packages/mdi/src/hooks/useSyncTabBarScrollToActiveTab.ts
 * @description Syncs `.tabListWrap` scroll position to the active MDI tab.
 * @created 2026-06-27
 */
import { useEffect, useLayoutEffect, type RefObject } from 'react';
import { syncTabBarScrollToActiveTab } from '../utils/tabScroll';

export function useSyncTabBarScrollToActiveTab(
  activeTabId: string | null,
  tabListWrapRef: RefObject<HTMLDivElement | null>,
): void {
  useLayoutEffect(() => {
    return syncTabBarScrollToActiveTab(activeTabId, tabListWrapRef.current);
  }, [activeTabId, tabListWrapRef]);

  useEffect(() => {
    return syncTabBarScrollToActiveTab(activeTabId, tabListWrapRef.current);
  }, [activeTabId, tabListWrapRef]);
}
