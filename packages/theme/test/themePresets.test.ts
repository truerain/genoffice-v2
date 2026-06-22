/**
 * @file packages/theme/test/themePresets.test.ts
 * @description Tests for JS theme and chart token presets.
 * @created 2026-06-22
 */
import { describe, expect, it } from 'vitest';

import { lightTheme } from '../src/themes/light';
import { darkTheme } from '../src/themes/dark';
import { lightChartTokens, darkChartTokens } from '../src/themes/chart';
import type { Theme } from '../src/types/theme.types';
import type { ChartTokens } from '../src/types/chart.tokens';

const themeColorGroups: (keyof Theme['colors'])[] = [
  'background',
  'foreground',
  'brand',
  'status',
  'border',
];

function expectThemeShape(theme: Theme, mode: Theme['mode']) {
  expect(theme.mode).toBe(mode);
  for (const group of themeColorGroups) {
    expect(theme.colors[group]).toBeTypeOf('object');
    for (const value of Object.values(theme.colors[group])) {
      expect(value).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  }
}

function expectChartTokenShape(tokens: ChartTokens) {
  expect(tokens.color.seriesPalette.length).toBeGreaterThanOrEqual(2);
  expect(tokens.typography.axisTickFontSize).toBeGreaterThan(0);
  expect(tokens.spacing.paddingTop).toBeGreaterThanOrEqual(0);
  expect(tokens.border.seriesStrokeWidth).toBeGreaterThan(0);
  expect(['linear', 'easeOut', 'easeInOut']).toContain(tokens.motion.easing);
}

describe('theme presets', () => {
  it('lightTheme has expected mode and hex colors', () => {
    expectThemeShape(lightTheme, 'light');
  });

  it('darkTheme has expected mode and hex colors', () => {
    expectThemeShape(darkTheme, 'dark');
  });

  it('light and dark presets use different background primary', () => {
    expect(lightTheme.colors.background.primary).not.toBe(
      darkTheme.colors.background.primary,
    );
  });

  it('chart presets satisfy ChartTokens shape', () => {
    expectChartTokenShape(lightChartTokens);
    expectChartTokenShape(darkChartTokens);
  });

  it('chart presets differ between light and dark', () => {
    expect(lightChartTokens.color.background).not.toBe(darkChartTokens.color.background);
    expect(lightChartTokens.color.textPrimary).not.toBe(darkChartTokens.color.textPrimary);
  });
});
