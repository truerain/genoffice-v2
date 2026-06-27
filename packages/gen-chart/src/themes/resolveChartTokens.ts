/**
 * @file packages/gen-chart/src/themes/resolveChartTokens.ts
 * @description Merge theme preset and partial token overrides.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ChartTheme, DeepPartial } from '../types/common';
import type { ChartTokens } from '../types/tokens';
import { darkChartTokens } from './darkChartTokens';
import { lightChartTokens } from './lightChartTokens';

function mergeDeep<T extends object>(base: T, partial?: DeepPartial<T>): T {
  if (!partial) return base;
  const result = { ...base } as T;
  for (const key of Object.keys(partial) as Array<keyof T>) {
    const value = partial[key];
    if (value === undefined) continue;
    const baseValue = base[key];
    if (
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue) &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      result[key] = mergeDeep(baseValue as object, value as DeepPartial<object>) as T[keyof T];
    } else {
      result[key] = value as T[keyof T];
    }
  }
  return result;
}

export function resolveChartTokens(
  theme: ChartTheme = 'light',
  tokens?: DeepPartial<ChartTokens>,
): ChartTokens {
  const preset = theme === 'dark' ? darkChartTokens : lightChartTokens;
  return mergeDeep(preset, tokens);
}
