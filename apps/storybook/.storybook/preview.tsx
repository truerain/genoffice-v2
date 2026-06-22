import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from '@gen-office/theme';
import '../../../packages/theme/src/index.css';

const preview: Preview = {
  parameters: {
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
