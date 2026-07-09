/**
 * @file packages/gen-frame/src/navigation/createMdiNavigationController.ts
 * @description MDI-backed NavigationController factory (Gate F3).
 * @created 2026-06-29
 *
 * @remark
 * - Same pageId re-open activates existing tab (mdi store policy)
 *
 */

import type {
  CreateMdiNavigationControllerOptions,
  FrameOpenPagePayload,
  NavigationController,
} from '../types';

export function createMdiNavigationController({
  store,
  resolveTab,
}: CreateMdiNavigationControllerOptions): NavigationController {
  return {
    open(payload: FrameOpenPagePayload) {
      const tab = resolveTab(payload);
      return store.addTab({
        id: tab.id,
        title: tab.title,
        content: tab.content,
        closable: tab.closable ?? true,
        meta: tab.meta,
      });
    },

    activate(pageId: string) {
      store.setActiveTab(pageId);
    },

    close(pageId: string) {
      store.removeTab(pageId);
    },

    closeAll() {
      store.closeAllClosableTabs();
    },
  };
}
