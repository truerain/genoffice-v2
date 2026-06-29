/**
 * @file apps/demo/src/main.tsx
 * @description React entry for @gen-office/demo.
 * @created 2026-06-28
 * @updated 2026-06-28
 *
 * @remark
 * - AppProviders wraps Theme, auth, toast
 * - CSS: theme, ui, mdi, app layout
 *
 * @history
 * - 2026-06-29 F3: gen-frame CSS
 * - 2026-06-29 Soft Modern demo-ui.css
 * - 2026-06-28 D3: gen-chart CSS
 * - 2026-06-28 D1: AppProviders, mdi/ui CSS
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@gen-office/theme/index.css';
import '@gen-office/ui/index.css';
import '@gen-office/mdi/index.css';
import '@gen-office/gen-frame/index.css';
import '@gen-office/gen-chart/index.css';
import './styles/app.css';
import './styles/demo-ui.css';
import { AppProviders } from './app/providers/AppProviders';
import { App } from './app/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
