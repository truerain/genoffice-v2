/**
 * @file apps/demo/src/pages/placeholder/PlaceholderPage.tsx
 * @description Welcome placeholder — opened via componentRegistry (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 *
 * @history
 * - 2026-06-28 D2: AdminPageLayout + PageHeader + i18n
 */

import { AdminPageLayout } from '../../shared/components/AdminPageLayout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useI18n } from '../../i18n';
import styles from './PlaceholderPage.module.css';

export interface PlaceholderPageProps {
  title?: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const { t } = useI18n();
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
      <p className={styles.note}>
        Gate D2 — 메뉴에서 이 화면을 다시 열면 동일 <code>pageId</code> 탭이 활성화됩니다.
      </p>
    </AdminPageLayout>
  );
}
