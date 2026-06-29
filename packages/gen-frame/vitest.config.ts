/**
 * @file packages/gen-frame/vitest.config.ts
 * @description Vitest configuration for @gen-office/gen-frame.
 * @created 2026-06-29
 */
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

const themeCss = resolve(__dirname, '../theme/src/index.css');
const uiCss = resolve(__dirname, '../ui/src/index.css');

export default defineConfig({
  resolve: {
    alias: {
      '@gen-office/theme/index.css': themeCss,
      '@gen-office/ui/index.css': uiCss,
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: true,
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: true,
  },
});
