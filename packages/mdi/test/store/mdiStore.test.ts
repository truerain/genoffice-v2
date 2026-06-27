/**
 * @file packages/mdi/test/store/mdiStore.test.ts
 * @description Unit tests for useMDIStore (P0: maxTabs, onMaxTabsReached).
 * @created 2026-06-27
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMDIStore } from '../../src/store/mdiStore';
import type { MDITab } from '../../src/types';

function makeTab(id: string): MDITab {
  return { id, title: id, content: null };
}

describe('useMDIStore — maxTabs', () => {
  beforeEach(() => {
    useMDIStore.getState().reset();
  });

  it('addTab succeeds when under maxTabs', () => {
    useMDIStore.getState().setMaxTabs(2);
    expect(useMDIStore.getState().addTab(makeTab('a'))).toBe(true);
    expect(useMDIStore.getState().addTab(makeTab('b'))).toBe(true);
    expect(useMDIStore.getState().tabs).toHaveLength(2);
  });

  it('addTab returns false and invokes onMaxTabsReached at limit', () => {
    const onMaxTabsReached = vi.fn();
    useMDIStore.getState().setMaxTabs(1);
    useMDIStore.getState().setOnMaxTabsReached(onMaxTabsReached);
    useMDIStore.getState().addTab(makeTab('a'));

    expect(useMDIStore.getState().addTab(makeTab('b'))).toBe(false);
    expect(onMaxTabsReached).toHaveBeenCalledTimes(1);
    expect(useMDIStore.getState().tabs).toHaveLength(1);
  });

  it('focuses existing tab without invoking onMaxTabsReached', () => {
    const onMaxTabsReached = vi.fn();
    useMDIStore.getState().setMaxTabs(1);
    useMDIStore.getState().setOnMaxTabsReached(onMaxTabsReached);
    useMDIStore.getState().addTab(makeTab('a'));

    expect(useMDIStore.getState().addTab(makeTab('a'))).toBe(true);
    expect(onMaxTabsReached).not.toHaveBeenCalled();
    expect(useMDIStore.getState().activeTabId).toBe('a');
  });

  it('setMaxTabs lowering keeps open tabs and blocks only new addTab (policy A)', () => {
    useMDIStore.getState().setMaxTabs(3);
    useMDIStore.getState().addTab(makeTab('a'));
    useMDIStore.getState().addTab(makeTab('b'));
    useMDIStore.getState().addTab(makeTab('c'));

    useMDIStore.getState().setMaxTabs(1);
    expect(useMDIStore.getState().tabs).toHaveLength(3);
    expect(useMDIStore.getState().addTab(makeTab('d'))).toBe(false);
    expect(useMDIStore.getState().tabs).toHaveLength(3);
  });
});
