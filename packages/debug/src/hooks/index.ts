/**
 * @file packages/debug/src/hooks/index.ts
 * @description Public debug hooks barrel.
 * @created 2026-08-06
 *
 * @remark
 * - Re-exports useDebugState, useRenderCount, useWhyRender and their option types
 */

export { useDebugState } from './useDebugState';
export type { UseDebugStateOptions } from './useDebugState';

export { useRenderCount } from './useRenderCount';
export type { UseRenderCountOptions } from './useRenderCount';

export { useWhyRender } from './useWhyRender';
export type { UseWhyRenderOptions, WhyRenderDeps } from './useWhyRender';
