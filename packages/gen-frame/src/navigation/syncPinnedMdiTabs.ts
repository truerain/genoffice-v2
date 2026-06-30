/**
 * @file packages/gen-frame/src/navigation/syncPinnedMdiTabs.ts
 * @description Ensure pinned MDI tabs exist (`closable: false`) via resolveTab.
 * @created 2026-06-29
 *
 * @remark
 * - Used by useMdiNavigationController when `pinnedPages` is set
 *
 */

import type { FrameOpenPagePayload, MdiTabInput } from '../types';

export interface SyncPinnedMdiTabsStore {
  getTabs: () => Array<Pick<MdiTabInput, 'id' | 'title' | 'closable'>>;
  addTab: (tab: MdiTabInput) => boolean;
  updateTab: (id: string, updates: Partial<MdiTabInput>) => void;
}

export function syncPinnedMdiTabs(
  pinnedPages: FrameOpenPagePayload[],
  resolveTab: (payload: FrameOpenPagePayload) => MdiTabInput,
  store: SyncPinnedMdiTabsStore,
): void {
  const tabs = store.getTabs();

  for (const payload of pinnedPages) {
    const resolved = resolveTab(payload);
    const pinTab: MdiTabInput = {
      id: resolved.id,
      title: resolved.title,
      content: resolved.content,
      closable: false,
    };

    const existing = tabs.find((tab) => tab.id === pinTab.id);

    if (!existing) {
      store.addTab(pinTab);
      continue;
    }

    const updates: Partial<MdiTabInput> = {};

    if (existing.closable !== false) {
      updates.closable = false;
    }

    if (existing.title !== pinTab.title) {
      updates.title = pinTab.title;
    }

    if (Object.keys(updates).length > 0) {
      store.updateTab(pinTab.id, updates);
    }
  }
}
