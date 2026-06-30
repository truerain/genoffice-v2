/**
 * @file packages/gen-frame/src/navigation/useMdiNavigationController.ts
 * @description React hook for MDI NavigationController (Gate F3).
 * @created 2026-06-29
 * @updated 2026-06-29
 *
 * @remark
 * - Requires @gen-office/mdi in the React tree (default singleton store)
 * - `pinnedPages`: ensure `closable: false` tabs on mount / when payloads change
 *
 * @history
 * - 2026-06-29 pinnedPages + syncPinnedMdiTabs
 */

import { useEffect, useMemo } from 'react';
import { useMDIStore } from '@gen-office/mdi';
import { createMdiNavigationController } from './createMdiNavigationController';
import { syncPinnedMdiTabs } from './syncPinnedMdiTabs';
import type { UseMdiNavigationControllerOptions } from '../types';

export function useMdiNavigationController({
  resolveTab,
  pinnedPages,
  pinnedPagesEnabled = true,
}: UseMdiNavigationControllerOptions) {
  const addTab = useMDIStore((state) => state.addTab);
  const removeTab = useMDIStore((state) => state.removeTab);
  const setActiveTab = useMDIStore((state) => state.setActiveTab);
  const closeAllClosableTabs = useMDIStore((state) => state.closeAllClosableTabs);
  const updateTab = useMDIStore((state) => state.updateTab);

  const controller = useMemo(
    () =>
      createMdiNavigationController({
        store: {
          addTab,
          removeTab,
          setActiveTab,
          closeAllClosableTabs,
        },
        resolveTab,
      }),
    [addTab, closeAllClosableTabs, removeTab, resolveTab, setActiveTab],
  );

  useEffect(() => {
    if (!pinnedPagesEnabled || !pinnedPages?.length) {
      return;
    }

    syncPinnedMdiTabs(pinnedPages, resolveTab, {
      getTabs: () => useMDIStore.getState().tabs,
      addTab,
      updateTab,
    });
  }, [addTab, pinnedPages, pinnedPagesEnabled, resolveTab, updateTab]);

  return controller;
}
