/**
 * @file packages/ui/src/composed/pageLayout/PageLayout.tsx
 * @description Flex page shell with header, filter, and scroll/fill content regions.
 * @created 2026-07-01
 *
 * @remark
 * - Use contentVariant="fill" when children need grid/chart height chain
 *
 */

import { clsx } from 'clsx';

import type { PageLayoutProps } from './PageLayout.types';
import styles from './PageLayout.module.css';

export function PageLayout({
  header,
  filter,
  children,
  contentVariant = 'scroll',
  className,
}: PageLayoutProps) {
  const contentClass =
    contentVariant === 'fill'
      ? clsx(styles.content, styles.contentFill)
      : styles.content;

  return (
    <div className={clsx(styles.page, className)} data-gen-ui-page-layout="">
      {header}
      {filter ? <div className={styles.filter}>{filter}</div> : null}
      <div className={contentClass}>{children}</div>
    </div>
  );
}
