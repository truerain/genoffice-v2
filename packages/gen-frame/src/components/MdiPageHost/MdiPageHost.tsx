/**
 * @file packages/gen-frame/src/components/MdiPageHost/MdiPageHost.tsx
 * @description MDI workarea host — wraps @gen-office/mdi MDIContainer (Gate F3).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: MdiPageHost
 *
 */

import { clsx } from 'clsx';
import { MDIContainer } from '@gen-office/mdi';
import type { MdiPageHostProps } from '../../types';
import styles from './MdiPageHost.module.css';

export function MdiPageHost({
  maxTabs,
  tabPosition = 'top',
  tabBarLabels,
  emptyContent,
  onMaxTabsReached,
  className,
}: MdiPageHostProps) {
  return (
    <div className={clsx(styles.host, className)} data-gen-frame-mdi-host="">
      <MDIContainer
        maxTabs={maxTabs}
        tabPosition={tabPosition}
        tabBarLabels={tabBarLabels}
        emptyContent={emptyContent}
        onMaxTabsReached={onMaxTabsReached}
        className={styles.host}
      />
    </div>
  );
}
