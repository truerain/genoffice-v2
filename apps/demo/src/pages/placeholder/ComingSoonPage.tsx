/**
 * @file apps/demo/src/pages/placeholder/ComingSoonPage.tsx
 * @description Placeholder for V1 menu entries not yet ported to V2 demo.
 * @created 2026-07-07
 *
 * @remark
 * - Opened via componentRegistry when execComponent has no V2 page yet
 *
 */

import { PageHeader, PageLayout } from '@gen-office/ui';
import { useI18n } from '../../i18n';
import styles from './ComingSoonPage.module.css';

export interface ComingSoonPageProps {
  title?: string;
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  const { t } = useI18n();
  const pageTitle = title?.trim() || t('page.comingSoon.title');

  return (
    <PageLayout
      header={
        <PageHeader
          title={pageTitle}
          description={t('page.comingSoon.description')}
        />
      }
    >
      <p className={styles.note}>{t('page.comingSoon.note')}</p>
    </PageLayout>
  );
}
