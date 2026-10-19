/**
 * @file packages/gen-chart/vite.config.ts
 * @description Vite library build configuration for @gen-office/gen-chart.
 * @created 2026-06-27
 *
 * @remark
 * - Lib build uses Vite/esbuild JSX (no @vitejs/plugin-react)
 * - visx / d3-scale added in Gate C1+; C0 is types + stub exports only
 * - Declaration(.d.ts) emit는 build script의 `tsc -p tsconfig.build.json`가 담당
 *   (vite-plugin-dts@5는 composite+references 조합에서 파일을 쓰지 않음)
 */
import { defineConfig } from 'vite';
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
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GenOfficeGenChart',
      formats: ['es'],
      fileName: 'index',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@gen-office/theme'],
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
});
