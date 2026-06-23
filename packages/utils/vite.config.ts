/**
 * @file packages/utils/vite.config.ts
 * @description Vite library build configuration for @gen-office/utils.
 * @created 2026-06-23
 */
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GenOfficeUtils',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['clsx'],
      output: {
        globals: {
          clsx: 'clsx',
        },
      },
    },
  },
});
