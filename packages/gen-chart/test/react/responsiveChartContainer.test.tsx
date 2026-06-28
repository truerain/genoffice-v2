/**
 * @file packages/gen-chart/test/react/responsiveChartContainer.test.tsx
 * @description ResponsiveChartContainer measurement tests (Gate C7).
 * @created 2026-06-27
 *
 * @remark
 */

import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResponsiveChartContainer } from '../../src/react/components/ResponsiveChartContainer';

function SizeProbe() {
  return (
    <ResponsiveChartContainer minWidth={100} minHeight={80}>
      {(size) => (
        <span data-testid="size">
          {size.width}x{size.height}:{String(size.ready)}
        </span>
      )}
    </ResponsiveChartContainer>
  );
}

describe('ResponsiveChartContainer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads initial size from getBoundingClientRect', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 520,
      height: 260,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 520,
      bottom: 260,
      toJSON: () => ({}),
    });

    render(<SizeProbe />);

    expect(screen.getByTestId('size')).toHaveTextContent('520x260:true');
    expect(document.querySelector('[data-gen-chart-responsive]')).not.toBeNull();
  });

  it('uses fallback dimensions when measurement is zero', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      toJSON: () => ({}),
    });

    render(
      <ResponsiveChartContainer minWidth={100} minHeight={80} fallbackWidth={360} fallbackHeight={180}>
        {(size) => (
          <span data-testid="size">
            {size.width}x{size.height}:{String(size.ready)}
          </span>
        )}
      </ResponsiveChartContainer>,
    );

    expect(screen.getByTestId('size')).toHaveTextContent('360x180:false');
  });
});
