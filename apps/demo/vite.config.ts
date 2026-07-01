/**
 * @file apps/demo/vite.config.ts
 * @description Vite configuration for @gen-office/demo (Gate D0).
 * @created 2026-06-28
 *
 * @remark
 * - `esbuild.jsx: automatic` — `@vitejs/plugin-react` 6 + vite 6.4 exports 이슈 회피
 */

import { defineConfig } from 'vite';

export default defineConfig({
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
