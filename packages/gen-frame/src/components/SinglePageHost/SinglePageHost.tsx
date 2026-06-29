/**
 * @file packages/gen-frame/src/components/SinglePageHost/SinglePageHost.tsx
 * @description Single-page workarea host (Gate F5).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: SinglePageHost
 *
 */

import { clsx } from 'clsx';
import type { SinglePageHostProps } from '../../types';
import styles from './SinglePageHost.module.css';

export function SinglePageHost({ page, emptyContent, className }: SinglePageHostProps) {
  return (
    <div className={clsx(styles.host, className)} data-gen-frame-single-host="">
      {page ? (
        <div className={styles.content} data-gen-frame-single-content="" data-page-id={page.pageId}>
          {page.content}
        </div>
      ) : (
        <div className={styles.empty}>{emptyContent}</div>
      )}
    </div>
  );
}
