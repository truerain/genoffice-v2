/**
 * @file packages/gen-frame/test/navigation/syncPinnedMdiTabs.test.ts
 * @description Tests for syncPinnedMdiTabs.
 * @created 2026-06-29
 */
import { describe, expect, it, vi } from 'vitest';
import { syncPinnedMdiTabs } from '../../src/navigation/syncPinnedMdiTabs';
import type { FrameOpenPagePayload, MdiTabInput } from '../../src/types';

const homePayload: FrameOpenPagePayload = {
  pageId: 'home',
  title: 'Home',
};

function createStore() {
  const tabs: MdiTabInput[] = [];

  return {
    tabs,
    store: {
      getTabs: () => tabs,
      addTab: vi.fn((tab: MdiTabInput) => {
        tabs.push(tab);
        return true;
      }),
      updateTab: vi.fn((id: string, updates: Partial<MdiTabInput>) => {
        const index = tabs.findIndex((tab) => tab.id === id);
        if (index >= 0) {
          tabs[index] = { ...tabs[index], ...updates };
        }
      }),
    },
  };
}

describe('syncPinnedMdiTabs', () => {
  it('adds pinned tab with closable false', () => {
    const mock = createStore();

    syncPinnedMdiTabs([homePayload], (payload) => ({
      id: payload.pageId,
      title: payload.title,
      content: null,
      closable: true,
    }), mock.store);

    expect(mock.store.addTab).toHaveBeenCalledWith({
      id: 'home',
      title: 'Home',
      content: null,
      closable: false,
    });
  });

  it('updates closable and title when tab already exists', () => {
    const mock = createStore();
    mock.tabs.push({
      id: 'home',
      title: 'Old',
      content: null,
      closable: true,
    });

    syncPinnedMdiTabs(
      [{ pageId: 'home', title: 'Home' }],
      (payload) => ({
        id: payload.pageId,
        title: payload.title,
        content: null,
      }),
      mock.store,
    );

    expect(mock.store.addTab).not.toHaveBeenCalled();
    expect(mock.store.updateTab).toHaveBeenCalledWith('home', {
      closable: false,
      title: 'Home',
    });
  });
});
