/**
 * @file packages/mdi/src/components/TabBar/TabBar.tsx
 * @description MDI tab list, context menu, keyboard navigation.
 * @created 2026-06-27
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import { clsx } from 'clsx';
import { DEFAULT_TAB_BAR_LABELS, type TabBarProps } from '../../types';
import { useMDIStore, useMDIStoreApi } from '../../store/mdiStore';
import { useSyncTabBarScrollToActiveTab } from '../../hooks/useSyncTabBarScrollToActiveTab';
import { focusTabById } from '../../utils/tabFocus';
import {
  scrollTabElementIntoTabBarWhenReady,
  syncTabBarScrollToActiveTab,
} from '../../utils/tabScroll';
import { clampViewportPosition } from '../../utils/clampViewportPosition';
import { isTabListNavigationKey, resolveNextTabIndex } from '../../utils/tabListKeyboard';
import { Tab } from '../Tab';
import styles from './TabBar.module.css';

export const TabBar = ({ position, labels, className }: TabBarProps) => {
  const storeApi = useMDIStoreApi();
  const tabs = useMDIStore((state) => state.tabs);
  const activeTabId = useMDIStore((state) => state.activeTabId);
  const setActiveTab = useMDIStore((state) => state.setActiveTab);
  const removeTab = useMDIStore((state) => state.removeTab);
  const closeOtherTabs = useMDIStore((state) => state.closeOtherTabs);
  const closeAllClosableTabs = useMDIStore((state) => state.closeAllClosableTabs);

  const menuLabels = { ...DEFAULT_TAB_BAR_LABELS, ...labels };

  const [contextMenu, setContextMenu] = useState<{ tabId: string; x: number; y: number } | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ left: number; top: number } | null>(
    null,
  );
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const tabListRef = useRef<HTMLDivElement | null>(null);
  const tabListWrapRef = useRef<HTMLDivElement | null>(null);

  const hasClosableTabs = useMemo(() => tabs.some((tab) => tab.closable !== false), [tabs]);
  const canCloseOthers = useMemo(() => tabs.length > 1, [tabs.length]);
  const contextTab = useMemo(
    () => (contextMenu ? (tabs.find((tab) => tab.id === contextMenu.tabId) ?? null) : null),
    [contextMenu, tabs],
  );
  const canCloseCurrent = contextTab?.closable !== false;

  useSyncTabBarScrollToActiveTab(activeTabId, tabListWrapRef);

  const syncScrollToTab = useCallback((tabId: string) => {
    syncTabBarScrollToActiveTab(tabId, tabListWrapRef.current);
  }, []);

  const activeTabRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !tabListWrapRef.current) return;
      scrollTabElementIntoTabBarWhenReady(node, tabListWrapRef.current);
    },
    [activeTabId],
  );

  const focusActiveTab = useCallback(() => {
    queueMicrotask(() => {
      const currentActiveId = storeApi.getState().activeTabId;
      if (!currentActiveId) return;
      syncScrollToTab(currentActiveId);
      focusTabById(currentActiveId);
    });
  }, [storeApi, syncScrollToTab]);

  const selectTab = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      syncScrollToTab(tabId);
    },
    [setActiveTab, syncScrollToTab],
  );

  const selectTabWithFocus = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      syncScrollToTab(tabId);
      requestAnimationFrame(() => focusTabById(tabId));
    },
    [setActiveTab, syncScrollToTab],
  );

  const handleCloseTab = useCallback(
    (tabId: string) => {
      removeTab(tabId);
      focusActiveTab();
    },
    [focusActiveTab, removeTab],
  );

  const handleTabListKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!isTabListNavigationKey(event.key)) return;

      const target = event.target as HTMLElement;
      if (target.getAttribute('role') !== 'tab') return;

      const tabIds = tabs.map((tab) => tab.id);
      const currentIndex = tabIds.findIndex((id) => target.id === `tab-${id}`);
      const nextIndex = resolveNextTabIndex(currentIndex, tabIds.length, event.key);
      if (nextIndex === null) return;

      event.preventDefault();
      selectTabWithFocus(tabIds[nextIndex]);
    },
    [selectTabWithFocus, tabs],
  );

  const openContextMenu = useCallback((tabId: string, event: ReactMouseEvent) => {
    event.preventDefault();
    selectTab(tabId);
    const anchor = { x: event.clientX, y: event.clientY };
    setContextMenu({ tabId, ...anchor });
    setContextMenuPosition({ left: anchor.x, top: anchor.y });
  }, [selectTab]);

  useLayoutEffect(() => {
    if (!contextMenu) {
      setContextMenuPosition(null);
      return;
    }

    let frameId = 0;

    const clampMenuPosition = () => {
      const menu = contextMenuRef.current;
      if (!menu) return;

      const rect = menu.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        frameId = requestAnimationFrame(clampMenuPosition);
        return;
      }

      const next = clampViewportPosition(
        { x: contextMenu.x, y: contextMenu.y },
        { width: rect.width, height: rect.height },
      );

      setContextMenuPosition((prev) => {
        if (prev && prev.left === next.left && prev.top === next.top) return prev;
        return next;
      });
    };

    clampMenuPosition();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [contextMenu]);

  useEffect(() => {
    if (!contextMenu) return;

    const close = () => setContextMenu(null);
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-mdi-tab-context-menu="true"]')) return;
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('mousedown', onMouseDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('mousedown', onMouseDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [contextMenu]);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(styles.tabBar, styles[position], className)}
      role="tablist"
      aria-orientation="horizontal"
      ref={tabListRef}
      onKeyDown={handleTabListKeyDown}
    >
      <div className={styles.tabListWrap} ref={tabListWrapRef}>
        <div className={styles.tabList}>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              ref={tab.id === activeTabId ? activeTabRef : null}
              tab={tab}
              isActive={tab.id === activeTabId}
              onClick={() => selectTab(tab.id)}
              onContextMenu={(event) => openContextMenu(tab.id, event)}
              onClose={() => handleCloseTab(tab.id)}
            />
          ))}
        </div>
      </div>
      {contextMenu &&
        createPortal(
          <div
            ref={contextMenuRef}
            className={styles.contextMenu}
            style={{
              left: contextMenuPosition?.left ?? contextMenu.x,
              top: contextMenuPosition?.top ?? contextMenu.y,
            }}
            role="menu"
            data-mdi-tab-context-menu="true"
          >
            <button
              type="button"
              className={styles.contextMenuItem}
              onClick={() => {
                if (!contextTab || !canCloseCurrent) return;
                handleCloseTab(contextTab.id);
                setContextMenu(null);
              }}
              disabled={!canCloseCurrent}
            >
              {menuLabels.close}
            </button>
            <button
              type="button"
              className={styles.contextMenuItem}
              onClick={() => {
                if (!contextTab) return;
                closeOtherTabs(contextTab.id);
                focusActiveTab();
                setContextMenu(null);
              }}
              disabled={!canCloseOthers}
            >
              {menuLabels.closeOthers}
            </button>
            <button
              type="button"
              className={styles.contextMenuItem}
              onClick={() => {
                closeAllClosableTabs();
                focusActiveTab();
                setContextMenu(null);
              }}
              disabled={!hasClosableTabs}
            >
              {menuLabels.closeAll}
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
};
