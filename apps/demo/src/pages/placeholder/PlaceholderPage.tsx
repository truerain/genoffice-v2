/**
 * @file apps/demo/src/pages/placeholder/PlaceholderPage.tsx
 * @description Welcome placeholder — opened via componentRegistry (Gate D2).
 * @created 2026-06-28
 * @updated 2026-06-29
 *
 * @remark
 * - In-app links open MDI tabs via DemoNavigationContext (no URL reload)
 *
 * @history
 * - 2026-06-29 Welcome links to Chart / Dashboard demo
 * - 2026-06-28 D2: AdminPageLayout + PageHeader + i18n
 */

import { Button } from '@gen-office/ui';
import {
  DEMO_CHART_PAGE_ID,
  DEMO_DASHBOARD_PAGE_ID,
} from '../../app/menu/demoPageIds';
import { useDemoNavigation } from '../../app/navigation/DemoNavigationContext';
import { AdminPageLayout } from '../../shared/components/AdminPageLayout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useI18n } from '../../i18n';
import styles from './PlaceholderPage.module.css';

export interface PlaceholderPageProps {
  title?: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const { t } = useI18n();
  const { openMenuByPageId } = useDemoNavigation();
  const pageTitle = title ?? t('menu.placeholder');

  return (
    <AdminPageLayout
      header={
        <PageHeader
          title={pageTitle}
          description={t('page.placeholder.description')}
        />
      }
    >
      <p className={styles.note}>{t('page.placeholder.note')}</p>

      <section className={styles.links} aria-label={t('page.placeholder.linksTitle')}>
        <h2 className={styles.linksTitle}>{t('page.placeholder.linksTitle')}</h2>
        <div className={styles.linkRow}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => openMenuByPageId(DEMO_CHART_PAGE_ID)}
          >
            {t('page.placeholder.openChart')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => openMenuByPageId(DEMO_DASHBOARD_PAGE_ID)}
          >
            {t('page.placeholder.openDashboard')}
          </Button>
        </div>
        <p className={styles.linksHint}>{t('page.placeholder.linksHint')}</p>
      </section>
    </AdminPageLayout>
  );
}
