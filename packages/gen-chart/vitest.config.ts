/**
 * @file packages/gen-chart/vitest.config.ts
 * @description Vitest configuration for @gen-office/gen-chart.
 * @created 2026-06-27
 *
 * @remark
 */
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

const themeCss = resolve(__dirname, '../theme/src/index.css');

export default defineConfig({
  resolve: {
    alias: {
      '@gen-office/theme/index.css': themeCss,
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: true,
  },
});
