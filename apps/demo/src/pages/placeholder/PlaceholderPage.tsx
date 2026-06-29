/**
 * @file apps/demo/src/pages/placeholder/PlaceholderPage.tsx
 * @description MDI placeholder tab content (Gate D1).
 * @created 2026-06-28
 *
 * @remark
 * - D2: opened via componentRegistry
 *
 */

import styles from './PlaceholderPage.module.css';

export interface PlaceholderPageProps {
  title?: string;
}

export function PlaceholderPage({ title = 'Placeholder' }: PlaceholderPageProps) {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>
        Gate D1 — MDI tab content area. Registry-driven pages arrive in D2; chart demos in D3.
      </p>
    </div>
  );
}
