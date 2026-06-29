/**
 * @file apps/demo/src/pages/demo/ChartDemoPage.tsx
 * @description Chart demo slot — implemented in Gate D3 (registry entry D2).
 * @created 2026-06-28
 *
 * @remark
 * - D3: gen-chart composable sections
 *
 */

import { AdminPageLayout } from '../../shared/components/AdminPageLayout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useI18n } from '../../i18n';
import styles from './ComingSoonPage.module.css';

export function ChartDemoPage() {
  const { t } = useI18n();

  return (
    <AdminPageLayout
      header={
        <PageHeader
          title={t('menu.chartDemo')}
          description={t('page.chartDemo.description')}
        />
      }
    >
      <div className={styles.badge}>{t('page.chartDemo.comingSoon')}</div>
    </AdminPageLayout>
  );
}
