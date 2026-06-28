/**
 * @file packages/gen-chart/src/react/utils/formatAxisTick.ts
 * @description Default axis tick formatters.
 * @created 2026-06-27
 *
 * @remark
 */

import type { XValueKind } from '../../core/utils/xValue';

const defaultDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

export function createDefaultXTickFormat(kind: XValueKind) {
  if (kind === 'time') {
    return (value: unknown) => {
      const date =
        value instanceof Date
          ? value
          : typeof value === 'number'
            ? new Date(value)
            : new Date(String(value));
      return Number.isNaN(date.getTime()) ? String(value) : defaultDateFormatter.format(date);
    };
  }

  if (kind === 'linear') {
    return (value: unknown) => {
      const numeric = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(numeric) ? String(numeric) : String(value);
    };
  }

  return (value: unknown) => String(value);
}

export function createDefaultYTickFormat() {
  return (value: unknown) => {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return String(value);
    return Math.abs(numeric) >= 1000 ? numeric.toLocaleString() : String(numeric);
  };
}
