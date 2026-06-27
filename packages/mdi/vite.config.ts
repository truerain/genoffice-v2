/**
 * @file packages/mdi/vite.config.ts
 * @description Vite library build configuration for @gen-office/mdi.
 * @created 2026-06-27
 *
 * @remark
 * - Lib build uses Vite/esbuild JSX (no @vitejs/plugin-react)
 * - Storybook dev uses `@gen-office/storybook` in apps/storybook (no local `.storybook`)
 */
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
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
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: ['src/**/*.stories.tsx', 'src/**/*.stories.ts'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GenOfficeMdi',
      formats: ['es'],
      fileName: 'index',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@gen-office/theme',
        '@gen-office/ui',
        'clsx',
        'zustand',
        'lucide-react',
      ],
      output: {
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
