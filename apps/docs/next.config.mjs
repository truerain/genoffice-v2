/**
 * @file apps/docs/next.config.mjs
 * @description Next.js config for @gen-office/docs (Fumadocs MDX + workspace packages).
 * @created 2026-07-13
 *
 * @remark
 * - transpilePackages enables Next to consume workspace ESM packages.
 * - Docs imports gen-frame via `@/lib/gen-frame` (source components) to avoid theme reset CSS.
 * - Turbopack resolveAlias uses posix-relative paths (absolute Windows paths unsupported).
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();
const appDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: [
    '@gen-office/gen-datagrid',
    '@gen-office/gen-datagrid-crud',
    '@gen-office/gen-frame',
    '@gen-office/mdi',
    '@gen-office/theme',
    '@gen-office/ui',
    '@gen-office/utils',
  ],
  turbopack: {
    resolveAlias: {
      'next-themes': './src/lib/next-themes-compat.tsx',
      '@gen-office/gen-datagrid': '../../packages/gen-datagrid/dist/index.mjs',
      '@gen-office/gen-datagrid/index.css': '../../packages/gen-datagrid/dist/index.css',
      '@gen-office/gen-datagrid-crud': '../../packages/gen-datagrid-crud/dist/index.mjs',
      '@gen-office/gen-datagrid-crud/index.css':
        '../../packages/gen-datagrid-crud/dist/index.css',
      '@gen-office/theme': '../../packages/theme/dist/index.mjs',
      '@gen-office/theme/index.css': '../../packages/theme/dist/index.css',
      '@gen-office/ui': '../../packages/ui/dist/index.mjs',
      '@gen-office/ui/index.css': '../../packages/ui/dist/index.css',
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      'next-themes': path.join(appDir, 'src/lib/next-themes-compat.tsx'),
    };
    return webpackConfig;
  },
};

export default withMDX(config);
