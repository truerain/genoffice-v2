/**
 * @file packages/gen-chart/test/core/geometry.test.ts
 * @description Cartesian geometry unit tests.
 * @created 2026-06-27
 *
 * @remark
 */
import { describe, expect, it } from 'vitest';
import { computeXDomain } from '../../src/core/domain/computeXDomain';
import { computeYDomain } from '../../src/core/domain/computeYDomain';
import { buildCartesianGeometries } from '../../src/core/geometry/cartesian/buildGeometries';
import { computePlotArea } from '../../src/core/layout/computePlotArea';
import { normalizeSeries } from '../../src/core/normalizeSeries';
import { createCartesianScales } from '../../src/core/scale/createCartesianScales';

describe('buildCartesianGeometries', () => {
  it('builds line, bar, and area hit points', () => {
    const series = normalizeSeries([
      {
        id: 'line',
        type: 'line',
        data: [{ x: 'A', y: 10 }],
        x: (d) => d.x,
        y: (d) => d.y,
      },
      {
        id: 'bar',
        type: 'bar',
        data: [{ x: 'A', y: 20 }],
        x: (d) => d.x,
        y: (d) => d.y,
      },
      {
        id: 'area',
        type: 'area',
        data: [
          { x: 'A', y: 5 },
          { x: 'B', y: 15 },
        ],
        x: (d) => d.x,
        y: (d) => d.y,
      },
    ]);

    const plotArea = computePlotArea(400, 300);
    const xDomain = computeXDomain(series);
    const yDomain = computeYDomain(series);
    const scales = createCartesianScales(xDomain, yDomain, plotArea);
    const geometries = buildCartesianGeometries(series, scales);

    expect(geometries.lines).toHaveLength(1);
    expect(geometries.bars).toHaveLength(1);
    expect(geometries.areas).toHaveLength(1);
    expect(geometries.areas[0]?.path.length).toBeGreaterThan(0);
    expect(geometries.hitPoints.length).toBeGreaterThanOrEqual(4);
  });
});
