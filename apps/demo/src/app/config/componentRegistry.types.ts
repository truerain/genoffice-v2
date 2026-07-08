/**
 * @file apps/demo/src/app/config/componentRegistry.types.ts
 * @description Component registry type contracts (Gate D2).
 * @created 2026-06-28
 * @updated 2026-07-08
 *
 * @remark
 * - Exports: RegistryComponent, OpenPagePayload, ComponentName(re-export)
 * - ComponentName은 componentRegistry.ts에서 registry key로부터 파생 → 여기서 re-export
 *
 * @history
 * - 2026-07-08 D2 후속: ComponentName 선언 제거(파생 타입 re-export로 대체)
 */

import type { ComponentType } from 'react';
import type { ComponentName } from './componentRegistry';

export type { ComponentName };

export type RegistryComponent = ComponentType<Record<string, unknown>>;

export interface OpenPagePayload {
  pageId: string;
  title: string;
  componentName: ComponentName;
  params?: Record<string, string>;
}
