/**
 * @file apps/demo/src/pages/demo/DashboardDemoPage.tsx
 * @description Dashboard demo — 2×2 responsive chart card grid (Gate D3).
 * @created 2026-06-28
 *
 * @remark
 * - gen-chart C7 Dashboard story pattern
 *
 * @history
 * - 2026-06-28 D3: card grid implementation
 * - 2026-06-28 D2: coming-soon slot
 */

import { useMemo, type ReactNode } from 'react';
import type { CartesianChartOptions } from '@gen-office/gen-chart';
import {
  AreaSeries,
  BarSeries,
  CartesianPlot,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  LineSeries,
} from '@gen-office/gen-chart';
import { AdminPageLayout } from '../../shared/components/AdminPageLayout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useI18n } from '../../i18n';
import { monthlyData, type MonthlyPoint } from './chartDemoData';
import { DashboardChartCard } from './components/DashboardChartCard';
import styles from './DashboardDemoPage.module.css';

function plotMinimal(series: ReactNode) {
  return (
    <>
      <CartesianPlot>
        <ChartGrid />
        <ChartYAxis />
        <ChartXAxis />
        {series}
      </CartesianPlot>
      <ChartTooltip />
    </>
  );
}

function plotWithLegend(series: ReactNode) {
  return (
    <>
      <ChartLegend />
      <CartesianPlot>
        <ChartGrid />
        <ChartYAxis />
        <ChartXAxis />
        {series}
      </CartesianPlot>
      <ChartTooltip />
    </>
  );
}

export function DashboardDemoPage() {
  const { t } = useI18n();

  const revenueTrendOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
    () => ({
      series: [
        {
          id: 'revenue',
          label: 'Revenue',
          type: 'line',
          data: monthlyData,
          x: (d: MonthlyPoint) => d.month,
          y: (d: MonthlyPoint) => d.revenue,
        },
      ],
      interactive: { tooltip: true },
      motion: { mode: 'enter', durationMs: 240 },
    }),
    [],
  );

  const costBarOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
    () => ({
      series: [
        {
          id: 'cost',
          label: 'Cost',
          type: 'bar',
          data: monthlyData,
          x: (d: MonthlyPoint) => d.month,
          y: (d: MonthlyPoint) => d.cost,
        },
      ],
      interactive: { tooltip: true },
    }),
    [],
  );

  const ordersAreaOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
    () => ({
      series: [
        {
          id: 'orders',
          label: 'Orders',
          type: 'area',
          data: monthlyData,
          x: (d: MonthlyPoint) => d.month,
          y: (d: MonthlyPoint) => d.orders,
        },
      ],
      interactive: { tooltip: true },
    }),
    [],
  );

  const composedOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
    () => ({
      series: [
        {
          id: 'cost',
          label: 'Cost',
          type: 'bar',
          data: monthlyData,
          x: (d: MonthlyPoint) => d.month,
          y: (d: MonthlyPoint) => d.cost,
          layout: 'grouped',
        },
        {
          id: 'revenue',
          label: 'Revenue',
          type: 'line',
          data: monthlyData,
          x: (d: MonthlyPoint) => d.month,
          y: (d: MonthlyPoint) => d.revenue,
        },
      ],
      interactive: {
        tooltip: true,
        legend: { enabled: true, position: 'bottom', align: 'center', reserveSpace: true },
      },
    }),
    [],
  );

  return (
    <AdminPageLayout
      header={
        <PageHeader
          title={t('menu.dashboardDemo')}
          description={t('page.dashboardDemo.description')}
        />
      }
    >
      <div className={styles.page} data-gen-chart-dashboard="">
        <p className={styles.hint}>{t('page.dashboardDemo.hint')}</p>
        <div className={styles.grid}>
          <DashboardChartCard
            title={t('page.dashboardDemo.cards.revenueTrend')}
            options={revenueTrendOptions}
          >
            {plotMinimal(<LineSeries seriesId="revenue" />)}
          </DashboardChartCard>

          <DashboardChartCard
            title={t('page.dashboardDemo.cards.monthlyCost')}
            options={costBarOptions}
          >
            {plotMinimal(<BarSeries seriesId="cost" />)}
          </DashboardChartCard>

          <DashboardChartCard
            title={t('page.dashboardDemo.cards.orderVolume')}
            options={ordersAreaOptions}
          >
            {plotMinimal(<AreaSeries seriesId="orders" />)}
          </DashboardChartCard>

          <DashboardChartCard
            title={t('page.dashboardDemo.cards.revenueVsCost')}
            options={composedOptions}
            minChartHeight={180}
          >
            {plotWithLegend(
              <>
                <BarSeries seriesId="cost" />
                <LineSeries seriesId="revenue" />
              </>,
            )}
          </DashboardChartCard>
        </div>
      </div>
    </AdminPageLayout>
  );
}
