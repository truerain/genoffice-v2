/**
 * @file apps/demo/src/pages/demo/chartDemoData.ts
 * @description Sample datasets for Chart/Dashboard demo pages (Gate D3).
 * @created 2026-06-28
 *
 * @remark
 * - Mirrors gen-chart Storybook monthly / sales fixtures
 *
 */

export type MonthlyPoint = {
  month: string;
  revenue: number;
  cost: number;
  orders: number;
};

export const monthlyData: MonthlyPoint[] = [
  { month: 'Jan', revenue: 120, cost: 80, orders: 42 },
  { month: 'Feb', revenue: 150, cost: 95, orders: 51 },
  { month: 'Mar', revenue: 180, cost: 110, orders: 58 },
  { month: 'Apr', revenue: 140, cost: 100, orders: 47 },
  { month: 'May', revenue: 210, cost: 130, orders: 63 },
  { month: 'Jun', revenue: 190, cost: 125, orders: 59 },
];

export type SalesSlice = {
  category: string;
  value: number;
};

export const salesData: SalesSlice[] = [
  { category: 'Product A', value: 35 },
  { category: 'Product B', value: 25 },
  { category: 'Product C', value: 20 },
  { category: 'Product D', value: 12 },
  { category: 'Product E', value: 8 },
];
