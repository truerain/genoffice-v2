/**
 * @file packages/ui/src/composed/pageLayout/PageHeader.tsx
 * @description Page title chrome — title, description, actions slot.
 * @created 2026-07-01
 *
 * @remark
 * - V1 PageHeader subset ported for app page screens
 *
 */

import { clsx } from 'clsx';

import type { PageHeaderProps } from './PageLayout.types';
import styles from './PageHeader.module.css';

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={clsx(styles.header, className)}>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
