/**
 * @file apps/demo/src/app/AppShell.tsx
 * @description Authenticated shell — gen-frame WorkspaceFrame + MDI (Gate F3).
 * @created 2026-06-28
 * @updated 2026-06-29
 *
 * @remark
 * - @gen-office/gen-frame: layout chrome, menu, MdiPageHost
 * - URL `?menu=` → openMenuItem (same as menu click), then clear URL
 *
 * @history
 * - 2026-06-29 URL deep link via useDemoMenuDeepLink (not useUrlSync)
 * - 2026-06-29 FrameBrand + demo brand-logo.png override
 * - 2026-06-29 F3: WorkspaceFrame + MdiPageHost + FrameLayoutToggle
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  FrameBrand,
  FrameLayoutToggle,
  MdiPageHost,
  WorkspaceFrame,
  useFrameLayout,
} from '@gen-office/gen-frame';
import { useMDIStore } from '@gen-office/mdi';
import { Button } from '@gen-office/ui';
import demoBrandLogo from '../assets/brand-logo.png';
import { useAuth } from './providers/AuthProvider';
import { useAppToast } from './providers/AppToastProvider';
import { useOpenPage } from './hooks/useOpenPage';
import { useAppMenu } from './menu/useAppMenu';
import { findAppMenuItemByPageId, mapAppMenuToFrameItems } from './menu/mapAppMenuToFrame';
import { DemoNavigationProvider } from './navigation/DemoNavigationContext';
import { readInitialDemoMenuPageId } from './url/demoUrlSync';
import { useDemoMenuDeepLink } from './url/useDemoMenuDeepLink';
import { useI18n } from '../i18n';
import styles from './AppShell.module.css';

const DEMO_MAX_TABS = 10;
const DEMO_FRAME_LAYOUT_STORAGE_KEY = 'gen-office-demo-frame-layout';

const TAB_BAR_LABELS_KO = {
  close: '닫기',
  closeOthers: '다른 탭 닫기',
  closeAll: '모두 닫기',
} as const;

export function AppShell() {
  const { logout, username } = useAuth();
  const { showWarning } = useAppToast();
  const { openMenuItem, controller } = useOpenPage();
  const { items, isLoading: isMenuLoading, error: menuError } = useAppMenu();
  const { t, locale } = useI18n();
  const { layout, setLayout } = useFrameLayout('leftPanel', DEMO_FRAME_LAYOUT_STORAGE_KEY);
  const tabs = useMDIStore((state) => state.tabs);
  const activeTabId = useMDIStore((state) => state.activeTabId);

  const frameMenuItems = useMemo(
    () => mapAppMenuToFrameItems(items, locale),
    [items, locale],
  );

  const initialMenuPageIdOnMount = useRef(readInitialDemoMenuPageId()).current;

  const isMenuReady = !isMenuLoading && !menuError && items.length > 0;

  const openMenuByPageId = useCallback(
    (pageId: string) => {
      const appItem = findAppMenuItemByPageId(items, pageId);
      if (appItem) {
        openMenuItem(appItem);
      }
    },
    [items, openMenuItem],
  );

  useDemoMenuDeepLink({
    items,
    isMenuReady,
    openMenuItem,
  });

  const handleMaxTabsReached = useCallback(() => {
    showWarning(
      t('mdi.maxTabsTitle'),
      t('mdi.maxTabsMessage', { max: DEMO_MAX_TABS }),
    );
  }, [showWarning, t]);

  useEffect(() => {
    if (!isMenuReady || tabs.length > 0) {
      return;
    }
    if (initialMenuPageIdOnMount) {
      return;
    }
    openMenuItem(items[0]);
  }, [isMenuReady, items, openMenuItem, tabs.length]);

  const handleMenuSelect = useCallback(
    (frameItem: { id: string }) => {
      const appItem = findAppMenuItemByPageId(items, frameItem.id);
      if (appItem) {
        openMenuItem(appItem);
      }
    },
    [items, openMenuItem],
  );

  const handleLogout = async () => {
    controller.closeAll();
    await logout();
  };

  return (
    <DemoNavigationProvider openMenuByPageId={openMenuByPageId}>
      <div className={styles.shell}>
      <WorkspaceFrame
        className={styles.frame}
        layout={layout}
        header={
          <>
            <FrameBrand src={demoBrandLogo} alt="GenOffice Demo" />
            {username ? <span className={styles.user}>{username}</span> : null}
          </>
        }
        headerActions={
          <>
            <FrameLayoutToggle value={layout} onChange={setLayout} ariaLabel={t('frame.layout')} />
            <Button type="button" variant="ghost" size="sm" onClick={() => void handleLogout()}>
              {t('auth.logout')}
            </Button>
          </>
        }
        menu={{ items: isMenuLoading ? [] : frameMenuItems }}
        menuTitle={t('menu.title')}
        menuAriaLabel={t('menu.title')}
        activeMenuId={activeTabId ?? undefined}
        onMenuSelect={handleMenuSelect}
        workarea={
          isMenuLoading ? (
            <p className={styles.status}>{t('common.loading')}</p>
          ) : menuError ? (
            <p className={styles.error}>{menuError.message}</p>
          ) : (
            <div className={styles.workareaHost} data-demo-workarea="">
              <MdiPageHost
                maxTabs={DEMO_MAX_TABS}
                tabPosition="top"
                tabBarLabels={TAB_BAR_LABELS_KO}
                onMaxTabsReached={handleMaxTabsReached}
                emptyContent={<p className={styles.empty}>{t('mdi.empty')}</p>}
                className={styles.mdi}
              />
            </div>
          )
        }
      />
      </div>
    </DemoNavigationProvider>
  );
}
