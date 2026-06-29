/**
 * @file packages/gen-frame/src/navigation/useMdiNavigationController.ts
 * @description React hook for MDI NavigationController (Gate F3).
 * @created 2026-06-29
 *
 * @remark
 * - Requires @gen-office/mdi in the React tree (default singleton store)
 *
 */

import { useMemo } from 'react';
import { useMDIStore } from '@gen-office/mdi';
import { createMdiNavigationController } from './createMdiNavigationController';
import type { UseMdiNavigationControllerOptions } from '../types';

export function useMdiNavigationController({ resolveTab }: UseMdiNavigationControllerOptions) {
  const addTab = useMDIStore((state) => state.addTab);
  const removeTab = useMDIStore((state) => state.removeTab);
  const setActiveTab = useMDIStore((state) => state.setActiveTab);
  const closeAllClosableTabs = useMDIStore((state) => state.closeAllClosableTabs);

  return useMemo(
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
}
