/**
 * @file packages/utils/vitest.config.ts
 * @description Vitest configuration for @gen-office/utils unit tests.
 * @created 2026-06-23
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.{test,spec}.ts'],
    passWithNoTests: true,
  },
});
