/**
 * @file packages/mdi/src/store/mdiStore.ts
 * @description Zustand store for MDI tab state and actions.
 * @created 2026-06-27
 *
 * @remark
 * - maxTabs 하향 시 기존 탭 유지 (addTab만 차단) — review-plan P0.4 정책 A
 * - onMaxTabsReached는 MDIContainer가 setOnMaxTabsReached로 등록
 */
import { create } from 'zustand';
import { MDIStore, MDITab, TabPosition } from '../types';

const initialState = {
  tabs: [] as MDITab[],
  activeTabId: null as string | null,
  maxTabs: undefined as number | undefined,
  tabPosition: 'top' as TabPosition,
  onMaxTabsReached: undefined as (() => void) | undefined,
};

export const useMDIStore = create<MDIStore>((set, get) => ({
  ...initialState,

  addTab: (tab: MDITab): boolean => {
    const { tabs, maxTabs, onMaxTabsReached } = get();

    const existingTab = tabs.find((t) => t.id === tab.id);
    if (existingTab) {
      set({ activeTabId: tab.id });
      return true;
    }

    if (maxTabs !== undefined && tabs.length >= maxTabs) {
      console.warn(`Maximum tab limit (${maxTabs}) reached. Cannot add new tab.`);
      onMaxTabsReached?.();
      return false;
    }

    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: tab.id,
    }));

    return true;
  },

  removeTab: (id: string) => {
    const { tabs, activeTabId } = get();
    const tabIndex = tabs.findIndex((t) => t.id === id);

    if (tabIndex === -1) return;

    const newTabs = tabs.filter((t) => t.id !== id);

    let newActiveTabId = activeTabId;
    if (activeTabId === id) {
      if (newTabs.length > 0) {
        const newActiveIndex = tabIndex >= newTabs.length ? newTabs.length - 1 : tabIndex;
        newActiveTabId = newTabs[newActiveIndex].id;
      } else {
        newActiveTabId = null;
      }
    }

    set({
      tabs: newTabs,
      activeTabId: newActiveTabId,
    });
  },

  setActiveTab: (id: string) => {
    const { tabs } = get();
    if (tabs.some((t) => t.id === id)) {
      set({ activeTabId: id });
    }
  },

  setTabPosition: (position: TabPosition) => {
    set({ tabPosition: position });
  },

  updateTab: (id: string, updates: Partial<MDITab>) => {
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab)),
    }));
  },

  closeAllTabs: () => {
    set({
      tabs: [],
      activeTabId: null,
    });
  },

  closeAllClosableTabs: () => {
    const { tabs, activeTabId } = get();
    const preservedTabs = tabs.filter((tab) => tab.closable === false);
    const hasActiveTab =
      activeTabId != null && preservedTabs.some((tab) => tab.id === activeTabId);
    const nextActiveTabId = hasActiveTab
      ? activeTabId
      : (preservedTabs[preservedTabs.length - 1]?.id ?? null);

    set({
      tabs: preservedTabs,
      activeTabId: nextActiveTabId,
    });
  },

  closeOtherTabs: (id: string) => {
    const { tabs } = get();
    const targetTab = tabs.find((t) => t.id === id);

    if (targetTab) {
      const preservedTabs = tabs.filter((t) => t.closable === false && t.id !== id);
      set({
        tabs: [...preservedTabs, targetTab],
        activeTabId: id,
      });
    }
  },

  setMaxTabs: (max: number | undefined) => {
    set({ maxTabs: max });
  },

  setOnMaxTabsReached: (handler?: () => void) => {
    set({ onMaxTabsReached: handler });
  },

  reset: () => {
    set({ ...initialState });
  },
}));
