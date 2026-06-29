/**
 * @file packages/gen-frame/test/navigation/createSingleNavigationController.test.tsx
 * @description Tests for createSingleNavigationController.
 * @created 2026-06-29
 */
import { describe, expect, it, vi } from 'vitest';
import { createSingleNavigationController } from '../../src/navigation/createSingleNavigationController';
import type { FrameOpenPagePayload, SinglePageState } from '../../src/types';

const payload: FrameOpenPagePayload = {
  pageId: 'page-1',
  title: 'Page One',
};

function createMockStore() {
  let page: SinglePageState | null = null;

  return {
    getPage: () => page,
    setPage: vi.fn((next: SinglePageState | null) => {
      page = next;
    }),
    getCurrent: () => page,
  };
}

describe('createSingleNavigationController', () => {
  it('opens a page via resolvePage + setPage', () => {
    const store = createMockStore();
    const controller = createSingleNavigationController({
      store,
      resolvePage: () => ({
        content: <span>content</span>,
      }),
    });

    expect(controller.open(payload)).toBe(true);
    expect(store.setPage).toHaveBeenCalledWith({
      pageId: 'page-1',
      title: 'Page One',
      content: expect.anything(),
    });
  });

  it('no-ops when the same pageId is opened again', () => {
    const store = createMockStore();
    const controller = createSingleNavigationController({
      store,
      resolvePage: () => ({
        content: <span>content</span>,
      }),
    });

    controller.open(payload);
    controller.open(payload);

    expect(store.setPage).toHaveBeenCalledTimes(1);
    expect(store.getCurrent()?.pageId).toBe('page-1');
  });

  it('closes the current page and clears all', () => {
    const store = createMockStore();
    const controller = createSingleNavigationController({
      store,
      resolvePage: () => ({
        content: null,
      }),
    });

    controller.open(payload);
    controller.close('page-1');
    expect(store.getCurrent()).toBeNull();

    controller.open(payload);
    controller.closeAll();
    expect(store.getCurrent()).toBeNull();
  });
});
