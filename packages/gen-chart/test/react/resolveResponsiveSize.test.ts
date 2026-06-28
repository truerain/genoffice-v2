/**
 * @file packages/gen-chart/test/react/resolveResponsiveSize.test.ts
 * @description Unit tests for responsive size resolution (Gate C7).
 * @created 2026-06-27
 *
 * @remark
 */

import { describe, expect, it } from 'vitest';
import { resolveResponsiveSize } from '../../src/react/layout/resolveResponsiveSize';

describe('resolveResponsiveSize', () => {
  it('floors and clamps to minimum dimensions', () => {
    expect(
      resolveResponsiveSize({ width: 199.8, height: 80.2, minWidth: 120, minHeight: 100 }),
    ).toEqual({ width: 199, height: 100 });
  });

  it('applies aspect ratio from width', () => {
    expect(
      resolveResponsiveSize({
        width: 400,
        height: 50,
        minWidth: 120,
        minHeight: 80,
        aspectRatio: 2,
      }),
    ).toEqual({ width: 400, height: 200 });
  });

  it('respects minHeight when aspect ratio yields smaller height', () => {
    expect(
      resolveResponsiveSize({
        width: 100,
        height: 50,
        minWidth: 120,
        minHeight: 150,
        aspectRatio: 4,
      }),
    ).toEqual({ width: 120, height: 150 });
  });
});
