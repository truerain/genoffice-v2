/**
 * @file apps/demo/src/app/config/componentRegistry.ts
 * @description Registry helpers — derive ComponentName from map keys, validate (Gate D2).
 * @created 2026-06-28
 * @updated 2026-07-08
 *
 * @remark
 * - Exports: ComponentName(파생), COMPONENT_NAMES, isComponentName
 * - ComponentName = keyof typeof componentRegistry — dynamic 맵이 단일 소스
 *
 * @history
 * - 2026-07-08 D2 후속: ComponentName을 registry key에서 파생(이중 유지보수 제거)
 */

import { componentRegistry } from './componentRegistry.dynamic';

export type ComponentName = keyof typeof componentRegistry;

export const COMPONENT_NAMES = Object.keys(componentRegistry) as ComponentName[];

export function isComponentName(value: string): value is ComponentName {
  return value in componentRegistry;
}
