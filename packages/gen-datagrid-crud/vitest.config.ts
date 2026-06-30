/**
 * @file packages/gen-datagrid-crud/vitest.config.ts
 * @description Vitest configuration for @gen-office/gen-datagrid-crud.
 * @created 2026-06-29
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const themeCss = resolve(__dirname, '../theme/src/index.css');
const uiCss = resolve(__dirname, '../ui/src/index.css');
const datagridCss = resolve(__dirname, '../gen-datagrid/src/index.css');

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@gen-office/theme/index.css': themeCss,
      '@gen-office/ui/index.css': uiCss,
      '@gen-office/gen-datagrid/index.css': datagridCss,
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
