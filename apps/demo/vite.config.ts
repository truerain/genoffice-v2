/**
 * @file apps/demo/vite.config.ts
 * @description Vite configuration for @gen-office/demo (Gate D0).
 * @created 2026-06-28
 *
 * @remark
 * - `esbuild.jsx: automatic` — `@vitejs/plugin-react` 6는 vite 6.4 `exports` 이슈로 SPA dev 미사용
 * - MDI 탭 유지: `useDevMdiTabPersistence`(dev sessionStorage) + mdi HMR store 보존
 *
 * @history
 * - 2026-07-09 plugin-react 시도 → vite 6.4 ERR_PACKAGE_PATH_NOT_EXPORTED, 롤백
 */

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    jsx: 'automatic',
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
