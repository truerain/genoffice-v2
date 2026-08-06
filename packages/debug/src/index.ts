/**
 * @file packages/debug/src/index.ts
 * @description Public entry for @gen-office/debug (state + render inspection hooks).
 * @created 2026-08-06
 *
 * @remark
 * - Public API: resolveDebugEnabled, useDebugState, useRenderCount, useWhyRender
 * - DEV-oriented; prefer `enabled: import.meta.env.DEV` from apps
 * - No Dialog / DataGrid debug UI in this package
 */

export { resolveDebugEnabled } from './env';
export type { DebugEnabledOptions } from './env';

export {
  useDebugState,
  useRenderCount,
  useWhyRender,
} from './hooks';

export type {
  UseDebugStateOptions,
  UseRenderCountOptions,
  UseWhyRenderOptions,
  WhyRenderDeps,
} from './hooks';
