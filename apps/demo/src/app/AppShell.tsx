/**
 * @file apps/demo/src/app/AppShell.tsx
 * @description Authenticated app shell with header and MDI workspace (Gate D1).
 * @created 2026-06-28
 *
 * @remark
 * - flex 100vh chain; MDIContainer maxTabs=10
 * - onMaxTabsReached → useAppToast
 *
 * @history
 * - 2026-06-28 D1: AppShell + MDI + mock openPlaceholder
 */

import { useCallback, useEffect } from 'react';
import { MDIContainer, useMDIStore } from '@gen-office/mdi';
import { Button } from '@gen-office/ui';
import { useAuth } from './providers/AuthProvider';
import { useAppToast } from './providers/AppToastProvider';
import { useOpenPage } from './hooks/useOpenPage';
import styles from './AppShell.module.css';

const DEMO_MAX_TABS = 10;

const TAB_BAR_LABELS_KO = {
  close: '닫기',
  closeOthers: '다른 탭 닫기',
  closeAll: '모두 닫기',
} as const;

export function AppShell() {
  const { logout } = useAuth();
  const { showWarning } = useAppToast();
  const { openPlaceholder } = useOpenPage();
  const tabs = useMDIStore((state) => state.tabs);
  const closeAllClosableTabs = useMDIStore((state) => state.closeAllClosableTabs);

  const handleMaxTabsReached = useCallback(() => {
    showWarning(
      '탭 제한',
      `최대 ${DEMO_MAX_TABS}개까지만 탭을 열 수 있습니다.`,
    );
  }, [showWarning]);

  useEffect(() => {
    if (tabs.length === 0) {
      openPlaceholder();
    }
  }, [tabs.length, openPlaceholder]);

  const handleLogout = () => {
    closeAllClosableTabs();
    logout();
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerStart}>
          <span className={styles.brand}>GenOffice Demo</span>
        </div>
        <div className={styles.headerActions}>
          <Button type="button" variant="outline" size="sm" onClick={openPlaceholder}>
            샘플 탭 열기
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </header>
      <div className={styles.body}>
        <main className={styles.main}>
          <MDIContainer
            maxTabs={DEMO_MAX_TABS}
            tabPosition="top"
            tabBarLabels={TAB_BAR_LABELS_KO}
            onMaxTabsReached={handleMaxTabsReached}
            emptyContent={<p className={styles.empty}>열린 탭이 없습니다.</p>}
            className={styles.mdi}
          />
        </main>
      </div>
    </div>
  );
}
