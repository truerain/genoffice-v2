/**
 * @file packages/gen-chart/test/react/resolveTooltipPosition.test.ts
 * @description Tooltip position flip/clamp unit tests (Gate C6).
 * @created 2026-06-27
 *
 * @remark
 */

import { describe, expect, it } from 'vitest';
import { resolveTooltipPosition } from '../../src/react/components/chrome/resolveTooltipPosition';

const chart = { width: 400, height: 300 };
const tooltip = { width: 120, height: 48 };
const padding = 8;
const offset = 12;

describe('resolveTooltipPosition', () => {
  it('places tooltip below-right of anchor when space allows', () => {
    const position = resolveTooltipPosition({ x: 100, y: 80 }, tooltip, chart, {
      padding,
      offset,
    });

    expect(position).toEqual({ x: 112, y: 92 });
  });

  it('flips to the left when tooltip would overflow the right edge', () => {
    const anchor = { x: 350, y: 120 };
    const position = resolveTooltipPosition(anchor, tooltip, chart, { padding, offset });

    expect(position.x).toBe(anchor.x - offset - tooltip.width);
    expect(position.x + tooltip.width).toBeLessThanOrEqual(chart.width - padding);
  });

  it('flips above anchor when tooltip would overflow the bottom edge', () => {
    const anchor = { x: 120, y: 270 };
    const position = resolveTooltipPosition(anchor, tooltip, chart, { padding, offset });

    expect(position.y).toBe(anchor.y - offset - tooltip.height);
    expect(position.y + tooltip.height).toBeLessThanOrEqual(chart.height - padding);
  });

  it('clamps inside chart when anchor is near the top-left corner', () => {
    const position = resolveTooltipPosition({ x: 4, y: 6 }, tooltip, chart, {
      padding,
      offset,
    });

    expect(position.x).toBeGreaterThanOrEqual(padding);
    expect(position.y).toBeGreaterThanOrEqual(padding);
    expect(position.x + tooltip.width).toBeLessThanOrEqual(chart.width - padding);
    expect(position.y + tooltip.height).toBeLessThanOrEqual(chart.height - padding);
  });

  it('clamps inside chart when anchor is near the bottom-right corner', () => {
    const position = resolveTooltipPosition({ x: 392, y: 292 }, tooltip, chart, {
      padding,
      offset,
    });

    expect(position.x).toBeGreaterThanOrEqual(padding);
    expect(position.y).toBeGreaterThanOrEqual(padding);
    expect(position.x + tooltip.width).toBeLessThanOrEqual(chart.width - padding);
    expect(position.y + tooltip.height).toBeLessThanOrEqual(chart.height - padding);
  });
});
