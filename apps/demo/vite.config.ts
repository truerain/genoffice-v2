/**
 * @file apps/demo/vite.config.ts
 * @description Vite configuration for @gen-office/demo (Gate D0).
 * @created 2026-06-28
 *
 * @remark
 * - `@vitejs/plugin-react@4.7` — Vite 6.4 호환 Fast Refresh (plugin-react 6.x는 Vite 8 전용)
 *
 * @history
 * - 2026-07-09 plugin-react 복구 (esbuild-only full reload → 탭 초기화 이슈)
 */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        // Radix UI ships "use client" for RSC; Vite SPA bundles ignore the directive.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
});
