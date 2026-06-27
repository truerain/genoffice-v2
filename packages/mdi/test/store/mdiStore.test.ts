/**
 * @file packages/mdi/test/store/mdiStore.test.ts
 * @description Unit tests for useMDIStore.
 * @created 2026-06-27
 */
import { describe, expect, it, vi } from 'vitest';
import { useMDIStore } from '../../src/store/mdiStore';
import type { MDITab } from '../../src/types';

function makeTab(id: string, overrides: Partial<MDITab> = {}): MDITab {
  return { id, title: id, content: null, ...overrides };
}

describe('useMDIStore — maxTabs', () => {
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

describe('useMDIStore — tab id reopen (focus-only)', () => {
  it('does not update title or content when addTab is called with an existing id', () => {
    useMDIStore.getState().addTab(makeTab('a', { title: 'Original', content: 'v1' }));

    useMDIStore.getState().addTab(makeTab('a', { title: 'Updated', content: 'v2' }));

    const tab = useMDIStore.getState().tabs.find((t) => t.id === 'a');
    expect(tab?.title).toBe('Original');
    expect(tab?.content).toBe('v1');
    expect(useMDIStore.getState().activeTabId).toBe('a');
  });
});

describe('useMDIStore — removeTab & setActiveTab', () => {
  it('removeTab activates adjacent tab when closing the active tab', () => {
    useMDIStore.getState().addTab(makeTab('a'));
    useMDIStore.getState().addTab(makeTab('b'));
    useMDIStore.getState().setActiveTab('a');

    useMDIStore.getState().removeTab('a');

    expect(useMDIStore.getState().tabs.map((t) => t.id)).toEqual(['b']);
    expect(useMDIStore.getState().activeTabId).toBe('b');
  });

  it('setActiveTab ignores unknown id', () => {
    useMDIStore.getState().addTab(makeTab('a'));
    useMDIStore.getState().setActiveTab('missing');
    expect(useMDIStore.getState().activeTabId).toBe('a');
  });

  it('updateTab merges partial fields', () => {
    useMDIStore.getState().addTab(makeTab('a', { title: 'Old' }));
    useMDIStore.getState().updateTab('a', { title: 'New' });
    expect(useMDIStore.getState().tabs[0]?.title).toBe('New');
  });
});

describe('useMDIStore — closeOtherTabs & closeAllClosableTabs', () => {
  it('closeOtherTabs keeps pinned tabs and the target tab', () => {
    useMDIStore.getState().addTab(makeTab('pin', { closable: false }));
    useMDIStore.getState().addTab(makeTab('a'));
    useMDIStore.getState().addTab(makeTab('b'));

    useMDIStore.getState().closeOtherTabs('a');

    expect(useMDIStore.getState().tabs.map((t) => t.id)).toEqual(['pin', 'a']);
    expect(useMDIStore.getState().activeTabId).toBe('a');
  });

  it('closeAllClosableTabs removes only closable tabs', () => {
    useMDIStore.getState().addTab(makeTab('pin', { closable: false }));
    useMDIStore.getState().addTab(makeTab('a'));
    useMDIStore.getState().addTab(makeTab('b'));

    useMDIStore.getState().closeAllClosableTabs();

    expect(useMDIStore.getState().tabs.map((t) => t.id)).toEqual(['pin']);
    expect(useMDIStore.getState().activeTabId).toBe('pin');
  });

  it('closeAllTabs clears state', () => {
    useMDIStore.getState().addTab(makeTab('a'));
    useMDIStore.getState().closeAllTabs();
    expect(useMDIStore.getState().tabs).toHaveLength(0);
    expect(useMDIStore.getState().activeTabId).toBeNull();
  });
});

describe('useMDIStore — reset', () => {
  it('restores initial state', () => {
    useMDIStore.getState().addTab(makeTab('a'));
    useMDIStore.getState().setMaxTabs(5);
    useMDIStore.getState().reset();

    expect(useMDIStore.getState().tabs).toHaveLength(0);
    expect(useMDIStore.getState().maxTabs).toBeUndefined();
    expect(useMDIStore.getState().activeTabId).toBeNull();
  });
});
