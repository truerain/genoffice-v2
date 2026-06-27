/**
 * @file packages/mdi/src/components/TabBar/TabBar.tsx
 * @description MDI tab list, context menu, keyboard navigation.
 * @created 2026-06-27
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { clsx } from 'clsx';
import { DEFAULT_TAB_BAR_LABELS, type TabBarProps } from '../../types';
import { useMDIStore } from '../../store/mdiStore';
import { focusTabById } from '../../utils/tabFocus';
import { isTabListNavigationKey, resolveNextTabIndex } from '../../utils/tabListKeyboard';
import { Tab } from '../Tab';
import styles from './TabBar.module.css';

export const TabBar = ({ position, labels, className }: TabBarProps) => {
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

  const hasClosableTabs = useMemo(() => tabs.some((tab) => tab.closable !== false), [tabs]);
  const canCloseOthers = useMemo(() => tabs.length > 1, [tabs.length]);
  const contextTab = useMemo(
    () => (contextMenu ? (tabs.find((tab) => tab.id === contextMenu.tabId) ?? null) : null),
    [contextMenu, tabs],
  );
  const canCloseCurrent = contextTab?.closable !== false;

  const focusActiveTab = useCallback(() => {
    queueMicrotask(() => focusTabById(useMDIStore.getState().activeTabId));
  }, []);

  const handleCloseTab = useCallback(
    (tabId: string) => {
      removeTab(tabId);
      focusActiveTab();
    },
    [focusActiveTab, removeTab],
  );

  const activateTab = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      focusTabById(tabId);
    },
    [setActiveTab],
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
      const nextId = tabIds[nextIndex];
      activateTab(nextId);
    },
    [activateTab, tabs],
  );

  useLayoutEffect(() => {
    if (!contextMenu) {
      setContextMenuPosition(null);
      return;
    }
    const menu = contextMenuRef.current;
    if (!menu) {
      setContextMenuPosition({ left: contextMenu.x, top: contextMenu.y });
      return;
    }

    const viewportPadding = 8;
    const rect = menu.getBoundingClientRect();
    const maxLeft = Math.max(viewportPadding, window.innerWidth - rect.width - viewportPadding);
    const maxTop = Math.max(viewportPadding, window.innerHeight - rect.height - viewportPadding);

    const nextLeft = Math.min(Math.max(contextMenu.x, viewportPadding), maxLeft);
    const nextTop = Math.min(Math.max(contextMenu.y, viewportPadding), maxTop);

    setContextMenuPosition((prev) => {
      if (prev && prev.left === nextLeft && prev.top === nextTop) return prev;
      return { left: nextLeft, top: nextTop };
    });
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
      <div className={styles.tabListWrap}>
        <div className={styles.tabList}>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              tab={tab}
              isActive={tab.id === activeTabId}
              onClick={() => activateTab(tab.id)}
              onContextMenu={(event) => {
                event.preventDefault();
                activateTab(tab.id);
                setContextMenu({ tabId: tab.id, x: event.clientX, y: event.clientY });
              }}
              onClose={() => handleCloseTab(tab.id)}
            />
          ))}
        </div>
      </div>
      {contextMenu && (
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
        </div>
      )}
    </div>
  );
};
