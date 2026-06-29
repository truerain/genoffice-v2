/**
 * @file apps/demo/src/app/menu/mockMenu.ts
 * @description Static mock menu for VITE_USE_MOCK_MENU mode (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Flat demo entries for Placeholder, Chart, Dashboard slots
 *
 */

import type { AppMenuItem } from './menu.types';

export const MOCK_MENU_ITEMS: AppMenuItem[] = [
  {
    pageId: 'placeholder-welcome',
    componentName: 'PlaceholderPage',
    titleKey: 'menu.placeholder',
    path: '/placeholder',
  },
  {
    pageId: 'demo-chart',
    componentName: 'ChartDemoPage',
    titleKey: 'menu.chartDemo',
    path: '/demo/chart',
  },
  {
    pageId: 'demo-dashboard',
    componentName: 'DashboardDemoPage',
    titleKey: 'menu.dashboardDemo',
    path: '/demo/dashboard',
  },
];
