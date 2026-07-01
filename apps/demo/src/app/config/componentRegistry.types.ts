/**
 * @file apps/demo/src/app/config/componentRegistry.types.ts
 * @description Component registry type contracts (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - ComponentName union — keep in sync with componentRegistry.dynamic.ts
 *
 */

import type { ComponentType } from 'react';

export type ComponentName =
  | 'PlaceholderPage'
  | 'ChartDemoPage'
  | 'DashboardDemoPage'
  | 'UserManagementPage'
  | 'MenuManagementPage'
  | 'ActualsPage'
  | 'CustomerInfoPage';

export type RegistryComponent = ComponentType<Record<string, unknown>>;

export interface OpenPagePayload {
  pageId: string;
  title: string;
  componentName: ComponentName;
  params?: Record<string, string>;
}
