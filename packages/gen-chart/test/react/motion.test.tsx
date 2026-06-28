/**
 * @file packages/gen-chart/test/react/motion.test.tsx
 * @description Motion resolution and presentation tests (Gate C6b).
 * @created 2026-06-27
 *
 * @remark
 */

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { lightChartTokens } from '../../src/themes/lightChartTokens';
import { MOTION_LARGE_DATA_THRESHOLD, countSeriesPoints } from '../../src/react/motion/countSeriesPoints';
import { resolveChartMotion, resolveMotionInput } from '../../src/react/motion/resolveChartMotion';
import { ChartRoot } from '../../src/react/components/ChartRoot';
import { CartesianChart, CartesianPlot, LineSeries } from '../../src/react/components/cartesian';

describe('resolveChartMotion', () => {
  it('defaults to enter mode when motion is undefined and tokens enable motion', () => {
    const input = resolveMotionInput(undefined, lightChartTokens.motion);
    const resolved = resolveChartMotion(input, {
      prefersReducedMotion: false,
      pointCount: 10,
    });

    expect(resolved.enabled).toBe(true);
    expect(resolved.mode).toBe('enter');
    expect(resolved.durationMs).toBe(240);
  });

  it('disables motion for prefers-reduced-motion', () => {
    const input = resolveMotionInput(true, lightChartTokens.motion);
    const resolved = resolveChartMotion(input, {
      prefersReducedMotion: true,
      pointCount: 10,
    });

    expect(resolved.enabled).toBe(false);
    expect(resolved.disabledReason).toBe('reduced-motion');
  });

  it('disables motion for large data sets', () => {
    const input = resolveMotionInput({ mode: 'enter' }, lightChartTokens.motion);
    const resolved = resolveChartMotion(input, {
      prefersReducedMotion: false,
      pointCount: MOTION_LARGE_DATA_THRESHOLD,
    });

    expect(resolved.enabled).toBe(false);
    expect(resolved.disabledReason).toBe('large-data');
  });

  it('uses changeKey render key for reset-on-change mode', () => {
    const input = resolveMotionInput(
      { mode: 'reset-on-change', changeKey: 'batch-2' },
      lightChartTokens.motion,
    );
    const resolved = resolveChartMotion(input, {
      prefersReducedMotion: false,
      pointCount: 12,
    });

    expect(resolved.renderKey).toBe('batch-2');
  });
});

describe('countSeriesPoints', () => {
  it('sums series data lengths', () => {
    expect(
      countSeriesPoints([
        { data: [1, 2, 3] },
        { data: [4, 5] },
      ]),
    ).toBe(5);
  });
});

describe('series motion classes', () => {
  it('applies line motion class when motion enter is enabled', () => {
    const { container } = render(
      <ChartRoot
        width={400}
        height={300}
        options={{
          motion: { mode: 'enter', durationMs: 240 },
          series: [
            {
              id: 'line',
              type: 'line',
              data: [
                { label: 'A', value: 10 },
                { label: 'B', value: 20 },
              ],
              x: (d: { label: string }) => d.label,
              y: (d: { value: number }) => d.value,
            },
          ],
        }}
      >
        <CartesianChart>
          <CartesianPlot>
            <LineSeries seriesId="line" />
          </CartesianPlot>
        </CartesianChart>
      </ChartRoot>,
    );

    expect(container.querySelector('.gen-chart-motion-line-enter')).toBeTruthy();
  });

  it('warns and skips motion class for large data', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const data = Array.from({ length: MOTION_LARGE_DATA_THRESHOLD }, (_, index) => ({
      label: String(index),
      value: index,
    }));

    const { container } = render(
      <ChartRoot
        width={400}
        height={300}
        options={{
          motion: { mode: 'enter' },
          series: [
            {
              id: 'line',
              type: 'line',
              data,
              x: (d: { label: string }) => d.label,
              y: (d: { value: number }) => d.value,
            },
          ],
        }}
      >
        <CartesianChart>
          <CartesianPlot>
            <LineSeries seriesId="line" />
          </CartesianPlot>
        </CartesianChart>
      </ChartRoot>,
    );

    expect(container.querySelector('.gen-chart-motion-line-enter')).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('[gen-chart][GC006_MOTION_DISABLED_LARGE_DATA]'));
    warnSpy.mockRestore();
  });
});
