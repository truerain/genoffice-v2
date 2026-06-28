/**
 * @file packages/gen-chart/test/core/computePlotArea.test.ts
 * @description computePlotArea unit tests (Gate C2).
 * @created 2026-06-27
 *
 * @remark
 */

import { describe, expect, it } from 'vitest';
import {
  computeLegendReserveHeight,
  computePlotArea,
  resolveLegendOptions,
} from '../../src/core/layout/computePlotArea';
import { lightChartTokens } from '../../src/themes/lightChartTokens';

describe('resolveLegendOptions', () => {
  it('disables reserve when legend is false', () => {
    expect(resolveLegendOptions(false)).toEqual({
      enabled: false,
      position: 'bottom',
      reserveSpace: false,
    });
  });

  it('enables reserve by default for legend true', () => {
    expect(resolveLegendOptions(true)).toEqual({
      enabled: true,
      position: 'bottom',
      reserveSpace: true,
    });
  });

  it('disables reserve when legend is omitted', () => {
    expect(resolveLegendOptions(undefined)).toEqual({
      enabled: false,
      position: 'bottom',
      reserveSpace: false,
    });
  });
});

describe('computePlotArea', () => {
  const reserveHeight = computeLegendReserveHeight(lightChartTokens);
  const base = computePlotArea(400, 300);

  it('applies default padding', () => {
    expect(base.width).toBe(400 - lightChartTokens.spacing.paddingLeft - lightChartTokens.spacing.paddingRight);
    expect(base.height).toBe(300 - lightChartTokens.spacing.paddingTop - lightChartTokens.spacing.paddingBottom);
  });

  it('reserves bottom space when legend is enabled', () => {
    const withLegend = computePlotArea(400, 300, {
      legend: true,
      legendReserveHeight: reserveHeight,
    });

    expect(withLegend.height).toBe(base.height - reserveHeight);
    expect(withLegend.y).toBe(base.y);
  });

  it('reserves top space when legend position is top', () => {
    const withTopLegend = computePlotArea(400, 300, {
      legend: { enabled: true, position: 'top' },
      legendReserveHeight: reserveHeight,
    });

    expect(withTopLegend.height).toBe(base.height - reserveHeight);
    expect(withTopLegend.y).toBe(base.y + reserveHeight);
  });

  it('skips reserve when reserveSpace is false', () => {
    const withoutReserve = computePlotArea(400, 300, {
      legend: { enabled: true, reserveSpace: false },
      legendReserveHeight: reserveHeight,
    });

    expect(withoutReserve).toEqual(base);
  });
});
