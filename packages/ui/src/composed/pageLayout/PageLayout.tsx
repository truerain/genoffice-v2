/**
 * @file packages/ui/src/composed/pageLayout/PageLayout.tsx
 * @description Flex page shell with header, filter, and scroll/fill content regions.
 * @created 2026-07-01
 * @updated 2026-07-20
 *
 * @remark
 * - Use contentVariant="fill" when children need grid/chart height chain
 * - Header slot respects PageLayoutChromeProvider.showHeader (default true)
 *
 */

import { clsx } from 'clsx';

import { usePageLayoutChrome } from './PageLayoutChrome';
import type { PageLayoutProps } from './PageLayout.types';
import styles from './PageLayout.module.css';

export function PageLayout({
  header,
  filter,
  children,
  contentVariant = 'scroll',
  className,
}: PageLayoutProps) {
  const { showHeader } = usePageLayoutChrome();
  const contentClass =
    contentVariant === 'fill'
      ? clsx(styles.content, styles.contentFill)
      : styles.content;

  return (
    <div className={clsx(styles.page, className)} data-gen-ui-page-layout="">
      {showHeader ? header : null}
      {filter ? <div className={styles.filter}>{filter}</div> : null}
      <div className={contentClass}>{children}</div>
    </div>
  );
}
