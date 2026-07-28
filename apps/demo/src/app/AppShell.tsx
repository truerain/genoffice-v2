/**
 * @file apps/demo/src/app/AppShell.tsx
 * @description Authenticated shell — gen-frame WorkspaceFrame + MDI (Gate F3).
 * @created 2026-06-28
 * @updated 2026-07-20
 *
 * @remark
 * - @gen-office/gen-frame: layout chrome, menu, MdiPageHost
 * - Welcome pin: `pinnedPages` on AppShell → `useOpenPage({ pinnedPages })`
 * - URL `?menu=` → openMenuItem (same as menu click), then clear URL
 * - PageLayoutChromeProvider: settings-driven page header visibility
 * - DataGridCrudChromeProvider: settings-driven ActionBar button mode
 *
 * @history
 * - 2026-07-20 DataGridCrudChromeProvider + ActionBar icon mode in settings
 * - 2026-07-20 PageLayoutChromeProvider + page header toggle in settings
 * - 2026-06-29 pinnedPages defined on AppShell, passed to useOpenPage
 * - 2026-06-29 URL deep link via useDemoMenuDeepLink (not useUrlSync)
 * - 2026-06-29 FrameBrand + demo brand-logo.png override
 * - 2026-06-29 Settings gear + layout modal (replaces header logout / layout toggle)
 */

import { useCallback, useMemo, useState } from 'react';
import {
  FrameBrand,
  MdiPageHost,
  WorkspaceFrame,
  useFrameLayout,
  type FrameOpenPagePayload,
} from '@gen-office/gen-frame';
import { useMDIStore } from '@gen-office/mdi';
import { DataGridCrudChromeProvider } from '@gen-office/gen-datagrid-crud';
import { Button, PageLayoutChromeProvider } from '@gen-office/ui';
import { Settings } from 'lucide-react';
import demoBrandLogo from '../assets/brand-logo.png';
import { useAppToast } from './providers/AppToastProvider';
import { useOpenPage } from './hooks/useOpenPage';
import { useAppMenu } from './menu/useAppMenu';
import { DEMO_HOME_PAGE_ID } from './menu/demoPageIds';
import { findAppMenuItemByPageId, mapAppMenuToFrameItems } from './menu/mapAppMenuToFrame';
import { DemoNavigationProvider } from './navigation/DemoNavigationContext';
import { useDemoMenuDeepLink } from './url/useDemoMenuDeepLink';
import { DemoSettingsModal } from './settings/DemoSettingsModal';
import { useDemoPageChrome } from './settings/useDemoPageChrome';
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
  const { showWarning } = useAppToast();
  const { items, isLoading: isMenuLoading, error: menuError } = useAppMenu();
  const { t, locale } = useI18n();

  const pinnedPages = useMemo<FrameOpenPagePayload[]>(
    () => [
      {
        pageId: DEMO_HOME_PAGE_ID,
        title: t('menu.placeholder'),
        meta: { componentName: 'PlaceholderPage' },
      },
    ],
    [t, locale],
  );

  const { openMenuItem } = useOpenPage({ pinnedPages });
  const { layout, setLayout } = useFrameLayout('leftPanel', DEMO_FRAME_LAYOUT_STORAGE_KEY);
  const { showPageHeader, setShowPageHeader, actionBarButtonMode, setActionBarButtonMode } =
    useDemoPageChrome();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const activeTabId = useMDIStore((state) => state.activeTabId);

  const frameMenuItems = useMemo(
    () => mapAppMenuToFrameItems(items, locale),
    [items, locale],
  );

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

  const handleMenuSelect = useCallback(
    (frameItem: { id: string }) => {
      const appItem = findAppMenuItemByPageId(items, frameItem.id);
      if (appItem && !appItem.children?.length && appItem.componentName) {
        openMenuItem(appItem);
      }
    },
    [items, openMenuItem],
  );

  const handleBrandClick = useCallback(() => {
    openMenuByPageId(DEMO_HOME_PAGE_ID);
  }, [openMenuByPageId]);

  return (
    <DemoNavigationProvider openMenuByPageId={openMenuByPageId}>
      <div className={styles.shell}>
      <WorkspaceFrame
        className={styles.frame}
        layout={layout}
        header={
          <button
            type="button"
            className={styles.brandButton}
            onClick={handleBrandClick}
            aria-label={t('menu.placeholder')}
          >
            <FrameBrand src={demoBrandLogo} alt="GenOffice Demo" className={styles.brandLogo} />
          </button>
        }
        headerActions={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={styles.settingsButton}
            aria-label={t('settings.open')}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings aria-hidden size={18} />
          </Button>
        }
        menu={{ items: isMenuLoading ? [] : frameMenuItems }}
        menuTitle={t('menu.title')}
        menuAriaLabel={t('menu.title')}
        activeMenuId={activeTabId ?? undefined}
        onMenuSelect={handleMenuSelect}
        workarea={
          <PageLayoutChromeProvider showHeader={showPageHeader}>
            <DataGridCrudChromeProvider buttonMode={actionBarButtonMode}>
              {isMenuLoading ? (
                <p className={styles.status}>{t('common.loading')}</p>
              ) : menuError ? (
                <p className={styles.error}>{menuError.message}</p>
              ) : (
                <div className={styles.workareaHost} data-app-workarea="">
                  <MdiPageHost
                    maxTabs={DEMO_MAX_TABS}
                    tabPosition="bottom"
                    tabBarLabels={TAB_BAR_LABELS_KO}
                    onMaxTabsReached={handleMaxTabsReached}
                    emptyContent={<p className={styles.empty}>{t('mdi.empty')}</p>}
                    className={styles.mdi}
                  />
                </div>
              )}
            </DataGridCrudChromeProvider>
          </PageLayoutChromeProvider>
        }
      />
      <DemoSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        layout={layout}
        onLayoutChange={setLayout}
        showPageHeader={showPageHeader}
        onShowPageHeaderChange={setShowPageHeader}
        actionBarButtonMode={actionBarButtonMode}
        onActionBarButtonModeChange={setActionBarButtonMode}
      />
      </div>
    </DemoNavigationProvider>
  );
}
