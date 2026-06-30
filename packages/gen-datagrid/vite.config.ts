/**
 * @file packages/gen-datagrid/vite.config.ts
 * @description Vite library build configuration for @gen-office/gen-datagrid.
 * @created 2026-06-29
 *
 * @remark
 * - Lib build uses Vite/esbuild JSX (no @vitejs/plugin-react)
 *
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const themeCss = resolve(__dirname, '../theme/src/index.css');
const uiCss = resolve(__dirname, '../ui/src/index.css');

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@gen-office/theme/index.css': themeCss,
      '@gen-office/ui/index.css': uiCss,
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ['src/**/*.stories.tsx', 'src/**/*.stories.ts'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GenOfficeGenDataGrid',
      formats: ['es'],
      fileName: 'index',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@gen-office/ui',
        '@gen-office/theme',
        '@gen-office/utils',
        'lucide-react',
        'clsx',
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
