/**
 * @file apps/demo/src/shared/components/AdminPageLayout/AdminPageLayout.tsx
 * @description Flex height page frame for MDI tab content (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - flex: 1; min-height: 0 — grid/chart parent contract
 *
 */

import type { ReactNode } from 'react';
import styles from './AdminPageLayout.module.css';

export interface AdminPageLayoutProps {
  header?: ReactNode;
  filter?: ReactNode;
  children: ReactNode;
  /** `fill` — grid/chart height chain (overflow hidden). Default `scroll`. */
  contentVariant?: 'scroll' | 'fill';
}

export function AdminPageLayout({
  header,
  filter,
  children,
  contentVariant = 'scroll',
}: AdminPageLayoutProps) {
  const contentClass =
    contentVariant === 'fill' ? `${styles.content} ${styles.contentFill}` : styles.content;

  return (
    <div className={styles.page}>
      {header}
      {filter ? <div className={styles.filter}>{filter}</div> : null}
      <div className={contentClass}>{children}</div>
    </div>
  );
}
