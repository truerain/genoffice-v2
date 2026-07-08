/**
 * @file packages/gen-datagrid-crud/vite.config.ts
 * @description Vite library build configuration for @gen-office/gen-datagrid-crud.
 * @created 2026-06-29
 *
 * @remark
 * - Lib build uses Vite/esbuild JSX (no @vitejs/plugin-react)
 * - Declaration(.d.ts) emit는 build script의 `tsc -p tsconfig.build.json`가 담당
 *   (vite-plugin-dts@5는 composite+references 조합에서 파일을 쓰지 않아 제거)
 *
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

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
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GenOfficeGenDataGridCrud',
      formats: ['es'],
      fileName: 'index',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@gen-office/gen-datagrid',
        '@gen-office/ui',
        '@tanstack/react-table',
        'lucide-react',
      ],
      output: {
        entryFileNames: 'index.mjs',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css';
          return assetInfo.name ?? '[name][extname]';
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
