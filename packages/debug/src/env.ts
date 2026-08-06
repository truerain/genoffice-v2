/**
 * @file packages/debug/src/env.ts
 * @description Resolves whether debug hooks should run (DEV-oriented).
 * @created 2026-08-06
 *
 * @remark
 * - Prefer explicit `enabled: import.meta.env.DEV` from apps when using built dist
 * - Fallback reads Vite `import.meta.env`; if unavailable defaults to `true`
 */

export type DebugEnabledOptions = {
  /**
   * When omitted, reads Vite `import.meta.env` (works when the app resolves package source).
   * Built dist may bake DEV=false — pass `enabled` explicitly from the app if unsure.
   */
  enabled?: boolean;
};

/**
 * Prefer explicit `enabled` from the app (`import.meta.env.DEV`).
 * Fallback reads `import.meta.env` when the module is compiled by the app bundler.
 */
export function resolveDebugEnabled(enabled?: boolean): boolean {
  if (typeof enabled === 'boolean') {
    return enabled;
  }

  const env = (import.meta as ImportMeta & { env?: Record<string, unknown> }).env;
  if (env && typeof env === 'object') {
    if (typeof env.DEV === 'boolean') {
      return env.DEV;
    }
    if (typeof env.MODE === 'string') {
      return env.MODE !== 'production';
    }
  }

  return true;
}
