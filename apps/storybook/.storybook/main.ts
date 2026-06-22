import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = dirname(fileURLToPath(import.meta.url));
const themeSrc = join(configDir, '../../../packages/theme/src');

const config: StorybookConfig = {
  stories: [
    '../../../packages/*/src/**/*.mdx',
    '../../../packages/*/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        dedupe: ['react', 'react-dom'],
        alias: {
          ...config.resolve?.alias,
          '@gen-office/theme': join(themeSrc, 'index.ts'),
        },
      },
      optimizeDeps: {
        exclude: ['@gen-office/theme'],
      },
      build: {
        ...config.build,
        rollupOptions: {
          ...config.build?.rollupOptions,
          onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
              return;
            }
            warn(warning);
          },
        },
      },
    };
  },
};

export default config;
