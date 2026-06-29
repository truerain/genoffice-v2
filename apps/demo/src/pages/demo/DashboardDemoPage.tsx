/**
 * @file apps/demo/src/pages/demo/DashboardDemoPage.tsx
 * @description Dashboard demo slot — implemented in Gate D3 (registry entry D2).
 * @created 2026-06-28
 *
 * @remark
 * - D3: Dashboard card grid from gen-chart C7 pattern
 *
 */

import { AdminPageLayout } from '../../shared/components/AdminPageLayout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useI18n } from '../../i18n';
import styles from './ComingSoonPage.module.css';

export function DashboardDemoPage() {
  const { t } = useI18n();

  return (
    <AdminPageLayout
      header={
        <PageHeader
          title={t('menu.dashboardDemo')}
          description={t('page.dashboardDemo.description')}
        />
      }
    >
      <div className={styles.badge}>{t('page.dashboardDemo.comingSoon')}</div>
    </AdminPageLayout>
  );
}
