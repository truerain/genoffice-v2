/**
 * @file apps/demo/src/pages/demo/components/DemoChartSection.tsx
 * @description Section wrapper for a single chart demo block (Gate D3).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: DemoChartSection
 *
 */

import type { ReactNode } from 'react';
import styles from './DemoChartSection.module.css';

export interface DemoChartSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DemoChartSection({ title, description, children }: DemoChartSectionProps) {
  return (
    <section className={styles.section} data-demo-chart-section="">
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>
      <div className={styles.chartFrame}>{children}</div>
    </section>
  );
}
