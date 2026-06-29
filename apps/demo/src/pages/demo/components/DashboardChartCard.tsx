/**
 * @file apps/demo/src/pages/demo/components/DashboardChartCard.tsx
 * @description Dashboard card with responsive cartesian chart (Gate D3).
 * @created 2026-06-28
 *
 * @remark
 * - Pattern from gen-chart Dashboard.stories (C7)
 *
 */

import type { ReactNode } from 'react';
import type { CartesianChartOptions } from '@gen-office/gen-chart';
import {
  ChartRoot,
  ResponsiveChartContainer,
  CartesianChart,
} from '@gen-office/gen-chart';
import { DemoSurface } from '../../../shared/components/DemoSurface';
import styles from './DashboardChartCard.module.css';

export interface DashboardChartCardProps<T> {
  title: string;
  options: CartesianChartOptions<T>;
  children: ReactNode;
  minChartHeight?: number;
}

export function DashboardChartCard<T>({
  title,
  options,
  children,
  minChartHeight = 160,
}: DashboardChartCardProps<T>) {
  return (
    <DemoSurface
      as="section"
      variant="elevated"
      className={styles.card}
      data-gen-chart-dashboard-card=""
    >
      <header className={styles.header}>{title}</header>
      <div className={styles.body}>
        <ResponsiveChartContainer
          minHeight={minChartHeight}
          className={styles.chart}
        >
          {(size) =>
            size.ready ? (
              <ChartRoot width={size.width} height={size.height} options={options}>
                <CartesianChart>{children}</CartesianChart>
              </ChartRoot>
            ) : null
          }
        </ResponsiveChartContainer>
      </div>
    </DemoSurface>
  );
}
