/**
 * @file apps/demo/src/app/providers/AppProviders.tsx
 * @description Root React providers for @gen-office/demo.
 * @created 2026-06-28
 *
 * @remark
 * - Exports: AppProviders
 * - ThemeProvider, mock auth, app toast host
 *
 */

import type { ReactNode } from 'react';
import { ThemeProvider } from '@gen-office/theme';
import { AuthProvider } from './AuthProvider';
import { AppToastProvider } from './AppToastProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultMode="light" storageKey="gen-office-demo-theme">
      <AuthProvider>
        <AppToastProvider>{children}</AppToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
