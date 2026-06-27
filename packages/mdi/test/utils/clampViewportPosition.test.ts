/**
 * @file packages/mdi/test/utils/clampViewportPosition.test.ts
 * @description clampViewportPosition helper tests.
 * @created 2026-06-27
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clampViewportPosition } from '../../src/utils/clampViewportPosition';

describe('clampViewportPosition', () => {
  beforeEach(() => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns anchor when menu fits inside viewport', () => {
    expect(clampViewportPosition({ x: 120, y: 80 }, { width: 160, height: 120 })).toEqual({
      left: 120,
      top: 80,
    });
  });

  it('clamps top when menu overflows bottom edge', () => {
    expect(clampViewportPosition({ x: 120, y: 550 }, { width: 160, height: 120 })).toEqual({
      left: 120,
      top: 472,
    });
  });
});
