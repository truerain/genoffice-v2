/**
 * @file apps/demo/src/app/AppShell.tsx
 * @description Authenticated shell — header, menu sidebar, MDI (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - MenuSidebar → componentRegistry → MDI tabs
 * - maxTabs=10; onMaxTabsReached → toast
 *
 * @history
 * - 2026-06-28 D2: menu sidebar + registry openPage
 * - 2026-06-28 D1: AppShell + MDI + mock openPlaceholder
 */

import { useCallback, useEffect } from 'react';
import { MDIContainer, useMDIStore } from '@gen-office/mdi';
import { Button } from '@gen-office/ui';
import { useAuth } from './providers/AuthProvider';
import { useAppToast } from './providers/AppToastProvider';
import { useOpenPage } from './hooks/useOpenPage';
import { useAppMenu } from './menu/useAppMenu';
import { MenuSidebar } from './menu/MenuSidebar';
import { useI18n } from '../i18n';
import styles from './AppShell.module.css';

const DEMO_MAX_TABS = 10;

const TAB_BAR_LABELS_KO = {
  close: '닫기',
  closeOthers: '다른 탭 닫기',
  closeAll: '모두 닫기',
} as const;

export function AppShell() {
  const { logout, username } = useAuth();
  const { showWarning } = useAppToast();
  const { openMenuItem } = useOpenPage();
  const { items, isLoading: isMenuLoading } = useAppMenu();
  const { t } = useI18n();
  const tabs = useMDIStore((state) => state.tabs);
  const closeAllClosableTabs = useMDIStore((state) => state.closeAllClosableTabs);

  const handleMaxTabsReached = useCallback(() => {
    showWarning(
      t('mdi.maxTabsTitle'),
      t('mdi.maxTabsMessage', { max: DEMO_MAX_TABS }),
    );
  }, [showWarning, t]);

  useEffect(() => {
    if (isMenuLoading || tabs.length > 0 || items.length === 0) {
      return;
    }
    const firstItem = items[0];
    openMenuItem(firstItem);
  }, [isMenuLoading, items, openMenuItem, tabs.length]);

  const handleLogout = async () => {
    closeAllClosableTabs();
    await logout();
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerStart}>
          <span className={styles.brand}>GenOffice Demo</span>
          {username ? (
            <span className={styles.user}>{username}</span>
          ) : null}
        </div>
        <div className={styles.headerActions}>
          <Button type="button" variant="ghost" size="sm" onClick={() => void handleLogout()}>
            {t('auth.logout')}
          </Button>
        </div>
      </header>
      <div className={styles.body}>
        <MenuSidebar />
        <main className={styles.main} data-demo-workarea="">
          <MDIContainer
            maxTabs={DEMO_MAX_TABS}
            tabPosition="top"
            tabBarLabels={TAB_BAR_LABELS_KO}
            onMaxTabsReached={handleMaxTabsReached}
            emptyContent={<p className={styles.empty}>{t('mdi.empty')}</p>}
            className={styles.mdi}
          />
        </main>
      </div>
    </div>
  );
}
