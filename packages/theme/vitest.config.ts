/**
 * @file packages/theme/vitest.config.ts
 * @description Vitest configuration for @gen-office/theme unit tests.
 * @created 2026-06-22
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: true,
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
  },
});
