/**
 * @file apps/demo/src/app/config/componentRegistry.dynamic.ts
 * @description Lazy component map — componentName → React.lazy (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - PlaceholderPage, ChartDemoPage, DashboardDemoPage
 * - D3 fills Chart/Dashboard page implementations
 *
 */

import { lazy } from 'react';
import type { ComponentName, RegistryComponent } from './componentRegistry.types';

export const componentRegistry: Record<ComponentName, RegistryComponent> = {
  PlaceholderPage: lazy(() =>
    import('../../pages/placeholder/PlaceholderPage').then((module) => ({
      default: module.PlaceholderPage as RegistryComponent,
    })),
  ),
  ChartDemoPage: lazy(() =>
    import('../../pages/demo/ChartDemoPage').then((module) => ({
      default: module.ChartDemoPage as RegistryComponent,
    })),
  ),
  DashboardDemoPage: lazy(() =>
    import('../../pages/demo/DashboardDemoPage').then((module) => ({
      default: module.DashboardDemoPage as RegistryComponent,
    })),
  ),
};
