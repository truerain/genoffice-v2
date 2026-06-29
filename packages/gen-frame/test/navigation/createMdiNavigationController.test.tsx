/**
 * @file packages/gen-frame/test/navigation/createMdiNavigationController.test.tsx
 * @description Tests for createMdiNavigationController.
 * @created 2026-06-29
 */
import { describe, expect, it, vi } from 'vitest';
import { createMdiNavigationController } from '../../src/navigation/createMdiNavigationController';
import type { FrameOpenPagePayload, MdiTabInput } from '../../src/types';

const payload: FrameOpenPagePayload = {
  pageId: 'page-1',
  title: 'Page One',
};

function createMockStore() {
  const tabs: MdiTabInput[] = [];
  let activeId: string | null = null;

  return {
    tabs,
    store: {
      addTab: (tab: MdiTabInput) => {
        const existing = tabs.find((entry) => entry.id === tab.id);
        if (existing) {
          activeId = tab.id;
          return true;
        }
        tabs.push(tab);
        activeId = tab.id;
        return true;
      },
      removeTab: vi.fn((id: string) => {
        const index = tabs.findIndex((entry) => entry.id === id);
        if (index >= 0) tabs.splice(index, 1);
      }),
      setActiveTab: vi.fn((id: string) => {
        activeId = id;
      }),
      closeAllClosableTabs: vi.fn(() => {
        tabs.length = 0;
        activeId = null;
      }),
    },
    getActiveId: () => activeId,
  };
}

describe('createMdiNavigationController', () => {
  it('opens a tab via resolveTab + addTab', () => {
    const addTab = vi.fn(() => true);
    const controller = createMdiNavigationController({
      store: {
        addTab,
        removeTab: vi.fn(),
        setActiveTab: vi.fn(),
        closeAllClosableTabs: vi.fn(),
      },
      resolveTab: (openPayload) => ({
        id: openPayload.pageId,
        title: openPayload.title,
        content: <span>content</span>,
      }),
    });

    expect(controller.open(payload)).toBe(true);
    expect(addTab).toHaveBeenCalledWith({
      id: 'page-1',
      title: 'Page One',
      content: expect.anything(),
      closable: true,
    });
  });

  it('reuses the same tab when pageId is opened again (mdi store semantics)', () => {
    const mock = createMockStore();
    const controller = createMdiNavigationController({
      store: mock.store,
      resolveTab: (openPayload) => ({
        id: openPayload.pageId,
        title: openPayload.title,
        content: <span>content</span>,
      }),
    });

    controller.open(payload);
    controller.open(payload);

    expect(mock.tabs).toHaveLength(1);
    expect(mock.getActiveId()).toBe('page-1');
  });

  it('closes tabs and clears closable tabs', () => {
    const removeTab = vi.fn();
    const closeAllClosableTabs = vi.fn();
    const controller = createMdiNavigationController({
      store: {
        addTab: vi.fn(() => true),
        removeTab,
        setActiveTab: vi.fn(),
        closeAllClosableTabs,
      },
      resolveTab: (openPayload) => ({
        id: openPayload.pageId,
        title: openPayload.title,
        content: null,
      }),
    });

    controller.close('page-1');
    controller.closeAll();

    expect(removeTab).toHaveBeenCalledWith('page-1');
    expect(closeAllClosableTabs).toHaveBeenCalledTimes(1);
  });
});
