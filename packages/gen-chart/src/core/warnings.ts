/**
 * @file packages/gen-chart/src/core/warnings.ts
 * @description Development-only warning helpers (GC001~GC006).
 * @created 2026-06-27
 *
 * @remark
 */

const PREFIX = '[gen-chart]';

function shouldWarn(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';
}

function warn(code: string, message: string): void {
  if (!shouldWarn()) return;
  console.warn(`${PREFIX}[${code}] ${message}`);
}

export function warnEmptySeries(): void {
  warn('GC001_EMPTY_SERIES', 'Provide at least one series.');
}

export function warnInvalidWidth(): void {
  warn('GC002_INVALID_WIDTH', 'Chart width must be greater than 0.');
}

export function warnInvalidHeight(): void {
  warn('GC003_INVALID_HEIGHT', 'Chart height must be greater than 0.');
}

export function warnDuplicateSeriesId(seriesId: string): void {
  warn(
    'GC004_DUPLICATE_SERIES_ID',
    `Duplicate series id "${seriesId}". Only the first definition is used.`,
  );
}

export function warnNoFiniteY(seriesId: string): void {
  warn(
    'GC005_NO_FINITE_Y',
    `Series "${seriesId}" has no finite y values and may be excluded from rendering.`,
  );
}

export function warnMotionDisabledLargeData(pointCount: number): void {
  warn(
    'GC006_MOTION_DISABLED_LARGE_DATA',
    `Motion disabled because total point count (${pointCount}) is >= 2000.`,
  );
}
