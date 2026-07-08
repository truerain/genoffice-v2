/**
 * @file apps/demo/src/app/config/componentRegistry.dynamic.ts
 * @description Lazy component map — componentName → React.lazy default page (Gate D2).
 * @created 2026-06-28
 * @updated 2026-07-08
 *
 * @remark
 * - 페이지는 default export; 항목은 `page(() => import('@/...'))` 한 줄
 * - ComponentName은 이 맵의 key에서 파생 (componentRegistry.ts)
 * - 새 페이지: 아래 맵에 한 줄 추가 + 페이지 default export
 *
 * @history
 * - 2026-07-08 D2 후속: default export 한 줄 로더 + @/ alias + key 파생 타입
 */

import { lazy, type ComponentType } from 'react';
import type { RegistryComponent } from './componentRegistry.types';

/** default export 페이지 모듈을 registry 컴포넌트로 래핑 (페이지별 prop 타입 캐스팅 제거) */
const page = (loader: () => Promise<{ default: ComponentType<Record<string, never>> }>): RegistryComponent =>
  lazy(loader) as unknown as RegistryComponent;

export const componentRegistry = {
  // 공통 / 플레이스홀더
  PlaceholderPage: page(() => import('@/pages/placeholder/PlaceholderPage')),
  ComingSoonPage: page(() => import('@/pages/placeholder/ComingSoonPage')),

  // Demo
  ChartDemoPage: page(() => import('@/pages/demo/ChartDemoPage')),
  DashboardDemoPage: page(() => import('@/pages/demo/DashboardDemoPage')),

  // 시스템 관리
  UserPage: page(() => import('@/pages/admin/user/UserPage')),
  MenuPage: page(() => import('@/pages/admin/menu/MenuPage')),

  // 업무
  ActualsPage: page(() => import('@/pages/co/actuals/ActualsPage')),
  CustomerInfoPage: page(() => import('@/pages/customer/customer-info/CustomerInfoPage')),
} satisfies Record<string, RegistryComponent>;
