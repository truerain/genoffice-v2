/**
 * @file packages/ui/vitest.config.ts
 * @description Vitest configuration for @gen-office/ui component tests.
 * @created 2026-06-23
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
  },
});
