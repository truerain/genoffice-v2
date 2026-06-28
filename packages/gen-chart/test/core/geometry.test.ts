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
import { buildAreaGeometry, resolveAreaBaselineY } from '../../src/core/geometry/cartesian/areaPath';
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

  it('uses y domain min as area baseline when domain excludes zero', () => {
    const series = normalizeSeries([
      {
        id: 'area',
        type: 'area',
        data: [
          { x: 'Jan', y: 120 },
          { x: 'Jun', y: 210 },
        ],
        x: (d) => d.x,
        y: (d) => d.y,
      },
    ]);

    const plotArea = computePlotArea(400, 300);
    const xDomain = computeXDomain(series);
    const yDomain = computeYDomain(series);
    const scales = createCartesianScales(xDomain, yDomain, plotArea);

    expect(yDomain[0]).toBeGreaterThan(0);

    const areaSeries = series[0]!;
    const { geometry } = buildAreaGeometry(areaSeries, scales);
    const baselineAtDomainMin = scales.yScale(yDomain[0]);
    const baselineAtZero = scales.yScale(0);

    expect(baselineAtZero).toBeGreaterThan(baselineAtDomainMin);

    const firstMove = geometry.path.match(/^M[\d.+-]+,([\d.+-]+)/);
    expect(Number(firstMove?.[1])).toBeCloseTo(baselineAtDomainMin, 5);
  });

  it('uses zero as area baseline when y domain includes zero', () => {
    const series = normalizeSeries([
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
    const scales = createCartesianScales(
      computeXDomain(series),
      computeYDomain(series),
      plotArea,
    );

    expect(resolveAreaBaselineY(scales.yScale.domain() as [number, number])).toBe(0);

    const { geometry } = buildAreaGeometry(series[0]!, scales);
    const firstMove = geometry.path.match(/^M[\d.+-]+,([\d.+-]+)/);
    expect(Number(firstMove?.[1])).toBeCloseTo(scales.yScale(0), 5);
  });
});
