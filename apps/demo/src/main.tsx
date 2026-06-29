/**
 * @file apps/demo/src/main.tsx
 * @description React entry for @gen-office/demo.
 * @created 2026-06-28
 *
 * @remark
 *
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@gen-office/theme';
import '@gen-office/theme/index.css';
import { App } from './app/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider defaultMode="light" storageKey="gen-office-demo-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
