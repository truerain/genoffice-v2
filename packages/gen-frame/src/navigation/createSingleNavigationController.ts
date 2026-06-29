/**
 * @file packages/gen-frame/src/navigation/createSingleNavigationController.ts
 * @description Single-page NavigationController factory (Gate F5).
 * @created 2026-06-29
 *
 * @remark
 * - Same pageId re-open is a no-op (matches mdi activate semantics)
 *
 */

import type {
  CreateSingleNavigationControllerOptions,
  FrameOpenPagePayload,
  NavigationController,
} from '../types';

export function createSingleNavigationController({
  store,
  resolvePage,
}: CreateSingleNavigationControllerOptions): NavigationController {
  return {
    open(payload: FrameOpenPagePayload) {
      const current = store.getPage();
      if (current?.pageId === payload.pageId) {
        return true;
      }

      const resolved = resolvePage(payload);
      store.setPage({
        pageId: payload.pageId,
        title: payload.title,
        content: resolved.content,
      });
      return true;
    },

    activate(pageId: string) {
      const current = store.getPage();
      if (current?.pageId === pageId) {
        return;
      }
    },

    close(pageId: string) {
      const current = store.getPage();
      if (current?.pageId === pageId) {
        store.setPage(null);
      }
    },

    closeAll() {
      store.setPage(null);
    },
  };
}
