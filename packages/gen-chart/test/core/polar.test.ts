/**
 * @file packages/gen-chart/test/core/polar.test.ts
 * @description Polar core unit tests (Gate C1.5).
 * @created 2026-06-27
 *
 * @remark
 */

import { describe, expect, it, vi } from 'vitest';
import { createPolarModel } from '../../src/core/createPolarModel';
import { buildPieArcs } from '../../src/core/geometry/polar/pieArcs';
import { polarNearest, pointAngleRad, isPointInArc } from '../../src/core/hit-test/polarNearest';
import { computePolarLayout } from '../../src/core/layout/computePolarLayout';
import { normalizePolarSeries } from '../../src/core/normalizePolarSeries';

type Slice = { name: string; amount: number };

const layout = { width: 200, height: 200 };

describe('normalizePolarSeries', () => {
  it('marks series without positive finite values as excluded', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = normalizePolarSeries([
      {
        id: 'empty',
        data: [{ name: 'A', amount: 0 }],
        value: (d) => d.amount,
      },
    ]);
    expect(result[0]?.excluded).toBe(true);
    spy.mockRestore();
  });

  it('detects donut via innerRadiusRatio', () => {
    const result = normalizePolarSeries([
      {
        id: 'donut',
        data: [{ name: 'A', amount: 10 }],
        value: (d) => d.amount,
        innerRadiusRatio: 0.4,
      },
    ]);
    expect(result[0]?.isDonut).toBe(true);
  });
});

describe('buildPieArcs', () => {
  it('builds slice arcs that sum to a full pie', () => {
    const series = normalizePolarSeries([
      {
        id: 'sales',
        data: [
          { name: 'A', amount: 30 },
          { name: 'B', amount: 70 },
        ],
        value: (d) => d.amount,
        labelKey: (d) => d.name,
      },
    ])[0]!;

    const polarLayout = computePolarLayout(200, 200);
    const arcs = buildPieArcs(series, polarLayout);

    expect(arcs).toHaveLength(2);
    expect(arcs[0]!.path.length).toBeGreaterThan(0);
    expect(arcs.reduce((sum, a) => sum + a.value, 0)).toBe(100);
  });
});

describe('polarNearest', () => {
  it('returns datum for point inside a slice', () => {
    const series = normalizePolarSeries([
      {
        id: 'sales',
        data: [
          { name: 'A', amount: 25 },
          { name: 'B', amount: 75 },
        ],
        value: (d) => d.amount,
        labelKey: (d) => d.name,
      },
    ])[0]!;

    const polarLayout = computePolarLayout(200, 200);
    const arcs = buildPieArcs(series, polarLayout);
    const largeSlice = arcs.find((a) => a.value === 75)!;

    const probeRadius = (largeSlice.innerRadius + largeSlice.outerRadius) / 2;
    const xPx = largeSlice.cx + probeRadius * Math.sin(largeSlice.midAngle);
    const yPx = largeSlice.cy - probeRadius * Math.cos(largeSlice.midAngle);

    const angle = pointAngleRad(largeSlice.cx, largeSlice.cy, xPx, yPx);
    expect(isPointInArc(probeRadius, angle, largeSlice)).toBe(true);

    const nearest = polarNearest(arcs, xPx, yPx);
    expect(nearest?.value).toBe(75);
    expect(nearest?.datum).toEqual({ name: 'B', amount: 75 });
  });
});

describe('createPolarModel', () => {
  it('exposes visible series and plot area', () => {
    const model = createPolarModel<Slice>(
      {
        series: [
          {
            id: 'sales',
            data: [{ name: 'A', amount: 100 }],
            value: (d) => d.amount,
          },
        ],
      },
      layout,
    );

    expect(model.visibleSeries).toHaveLength(1);
    expect(model.plotArea.width).toBeGreaterThan(0);
  });

  it('hides series on toggle and clears hit-test targets', () => {
    const model = createPolarModel<Slice>(
      {
        series: [
          {
            id: 'sales',
            data: [{ name: 'A', amount: 100 }],
            value: (d) => d.amount,
          },
        ],
      },
      layout,
    );

    const polarLayout = computePolarLayout(layout.width, layout.height);
    const cx = polarLayout.cx;
    const cy = polarLayout.cy;
    const r = polarLayout.outerRadius * 0.5;

    expect(model.getNearestDatum(cx, cy - r)).not.toBeNull();

    model.toggleSeries('sales');
    expect(model.visibleSeries).toHaveLength(0);
    expect(model.getNearestDatum(cx, cy - r)).toBeNull();
  });

  it('supports donut inner radius', () => {
    const model = createPolarModel<Slice>(
      {
        series: [
          {
            id: 'donut',
            data: [
              { name: 'X', amount: 40 },
              { name: 'Y', amount: 60 },
            ],
            value: (d) => d.amount,
            innerRadiusRatio: 0.5,
          },
        ],
      },
      layout,
    );

    const nearest = model.getNearestDatum(layout.width / 2, layout.height * 0.15);
    expect(nearest).not.toBeNull();
  });
});
