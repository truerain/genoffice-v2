/**
 * @file apps/demo/src/app/config/componentRegistry.ts
 * @description Registry helpers — validate componentName keys (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: isComponentName, COMPONENT_NAMES
 *
 */

import { componentRegistry } from './componentRegistry.dynamic';
import type { ComponentName } from './componentRegistry.types';

export const COMPONENT_NAMES = Object.keys(componentRegistry) as ComponentName[];

export function isComponentName(value: string): value is ComponentName {
  return value in componentRegistry;
}
