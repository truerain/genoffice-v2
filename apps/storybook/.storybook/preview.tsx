import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from '@gen-office/theme';
import '../../../packages/theme/src/index.css';

const preview: Preview = {
  parameters: {
    options: {
      // Root kinds only (first title segment). Use Theme/Theme in stories — not title: 'Theme'.
      storySort: {
        order: ['*', 'GenChart', 'MDI', 'UI', 'Theme'],
        method: 'alphabetical',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultMode="light" storageKey="gen-office-storybook-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
