/**
 * @file apps/demo/src/pages/demo/ChartDemoPage.tsx
 * @description Chart demo — line, bar, area, composed, pie, donut (Gate D3).
 * @created 2026-06-28
 *
 * @remark
 * - gen-chart composable API; ResponsiveChartContainer + ChartRoot
 *
 * @history
 * - 2026-06-28 D3: full chart sections
 * - 2026-06-28 D2: coming-soon slot
 */

import { useMemo, type ReactNode } from 'react';
import type { CartesianChartOptions, PolarChartOptions } from '@gen-office/gen-chart';
import {
  AreaSeries,
  BarSeries,
  CartesianChart,
  CartesianPlot,
  ChartGrid,
  ChartLegend,
  ChartRoot,
  ChartTooltip,
  ChartXAxis,
  ChartYAxis,
  DonutSeries,
  LineSeries,
  PieSeries,
  PolarChart,
  PolarPlot,
  ResponsiveChartContainer,
} from '@gen-office/gen-chart';
import { AdminPageLayout } from '../../shared/components/AdminPageLayout';
import { PageHeader } from '../../shared/components/PageHeader';
import { useI18n } from '../../i18n';
import { monthlyData, salesData, type MonthlyPoint, type SalesSlice } from './chartDemoData';
import { DemoChartSection } from './components/DemoChartSection';
import styles from './ChartDemoPage.module.css';

function CartesianSection({
  title,
  description,
  options,
  children,
}: {
  title: string;
  description?: string;
  options: CartesianChartOptions<MonthlyPoint>;
  children: ReactNode;
}) {
  return (
    <DemoChartSection title={title} description={description}>
      <ResponsiveChartContainer minHeight={280} className={styles.responsive}>
        {(size) =>
          size.ready ? (
            <ChartRoot width={size.width} height={size.height} options={options}>
              <CartesianChart>
                <CartesianPlot>
                  <ChartGrid />
                  <ChartYAxis />
                  <ChartXAxis />
                  {children}
                </CartesianPlot>
                <ChartTooltip />
              </CartesianChart>
            </ChartRoot>
          ) : null
        }
      </ResponsiveChartContainer>
    </DemoChartSection>
  );
}

function PolarSection({
  title,
  description,
  options,
  series,
}: {
  title: string;
  description?: string;
  options: PolarChartOptions<SalesSlice>;
  series: 'pie' | 'donut';
}) {
  const seriesDef = options.series[0];
  const seriesId = typeof seriesDef?.id === 'string' ? seriesDef.id : 'sales';

  return (
    <DemoChartSection title={title} description={description}>
      <ResponsiveChartContainer minHeight={280} className={styles.responsive}>
        {(size) =>
          size.ready ? (
            <PolarChart width={size.width} height={size.height} options={options}>
              <PolarPlot>
                {series === 'donut' ? (
                  <DonutSeries seriesId={seriesId} />
                ) : (
                  <PieSeries seriesId={seriesId} />
                )}
              </PolarPlot>
            </PolarChart>
          ) : null
        }
      </ResponsiveChartContainer>
    </DemoChartSection>
  );
}

export function ChartDemoPage() {
  const { t } = useI18n();

  const lineOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
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
    }),
    [],
  );

  const barOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
    () => ({
      series: [
        {
          id: 'revenue',
          label: 'Revenue',
          type: 'bar',
          data: monthlyData,
          x: (d: MonthlyPoint) => d.month,
          y: (d: MonthlyPoint) => d.revenue,
          layout: 'grouped',
        },
        {
          id: 'cost',
          label: 'Cost',
          type: 'bar',
          data: monthlyData,
          x: (d: MonthlyPoint) => d.month,
          y: (d: MonthlyPoint) => d.cost,
          layout: 'grouped',
        },
      ],
      interactive: { tooltip: true },
    }),
    [],
  );

  const areaOptions = useMemo<CartesianChartOptions<MonthlyPoint>>(
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

  const pieOptions = useMemo<PolarChartOptions<SalesSlice>>(
    () => ({
      series: [
        {
          id: 'sales',
          label: 'Sales by product',
          data: salesData,
          value: (d: SalesSlice) => d.value,
          labelKey: (d: SalesSlice) => d.category,
        },
      ],
      interactive: { tooltip: true },
    }),
    [],
  );

  const donutOptions = useMemo<PolarChartOptions<SalesSlice>>(
    () => ({
      series: [
        {
          id: 'share',
          label: 'Market share',
          data: salesData,
          value: (d: SalesSlice) => d.value,
          labelKey: (d: SalesSlice) => d.category,
          innerRadiusRatio: 0.55,
        },
      ],
      interactive: { tooltip: true },
    }),
    [],
  );

  return (
    <AdminPageLayout
      header={
        <PageHeader
          title={t('menu.chartDemo')}
          description={t('page.chartDemo.description')}
        />
      }
    >
      <div className={styles.sections} data-demo-chart-page="">
        <CartesianSection
          title={t('page.chartDemo.sections.line')}
          options={lineOptions}
        >
          <LineSeries seriesId="revenue" />
        </CartesianSection>

        <CartesianSection
          title={t('page.chartDemo.sections.bar')}
          options={barOptions}
        >
          <BarSeries seriesId="revenue" />
          <BarSeries seriesId="cost" />
        </CartesianSection>

        <CartesianSection
          title={t('page.chartDemo.sections.area')}
          options={areaOptions}
        >
          <AreaSeries seriesId="orders" />
        </CartesianSection>

        <DemoChartSection title={t('page.chartDemo.sections.composed')}>
          <ResponsiveChartContainer minHeight={300} className={styles.responsive}>
            {(size) =>
              size.ready ? (
                <ChartRoot width={size.width} height={size.height} options={composedOptions}>
                  <CartesianChart>
                    <ChartLegend />
                    <CartesianPlot>
                      <ChartGrid />
                      <ChartYAxis />
                      <ChartXAxis />
                      <BarSeries seriesId="cost" />
                      <LineSeries seriesId="revenue" />
                    </CartesianPlot>
                    <ChartTooltip />
                  </CartesianChart>
                </ChartRoot>
              ) : null
            }
          </ResponsiveChartContainer>
        </DemoChartSection>

        <PolarSection
          title={t('page.chartDemo.sections.pie')}
          options={pieOptions}
          series="pie"
        />

        <PolarSection
          title={t('page.chartDemo.sections.donut')}
          options={donutOptions}
          series="donut"
        />
      </div>
    </AdminPageLayout>
  );
}
