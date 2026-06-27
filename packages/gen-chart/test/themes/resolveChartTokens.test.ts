/**
 * @file packages/gen-chart/test/themes/resolveChartTokens.test.ts
 * @description Token merge unit tests.
 * @created 2026-06-27
 *
 * @remark
 */
import { describe, expect, it } from 'vitest';
import { resolveChartTokens } from '../../src/themes/resolveChartTokens';

describe('resolveChartTokens', () => {
  it('applies deep partial overrides', () => {
    const tokens = resolveChartTokens('light', {
      motion: { durationMs: 120 },
      color: { grid: '#000000' },
    });
    expect(tokens.motion.durationMs).toBe(120);
    expect(tokens.color.grid).toBe('#000000');
    expect(tokens.motion.easing).toBe('easeOut');
  });

  it('uses dark preset', () => {
    const tokens = resolveChartTokens('dark');
    expect(tokens.color.background).toBe('#0f172a');
  });
});
