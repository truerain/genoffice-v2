/**
 * @file apps/demo/src/app/providers/AppProviders.tsx
 * @description Root React providers for @gen-office/demo.
 * @created 2026-06-28
 *
 * @remark
 * - Exports: AppProviders
 * - ThemeProvider, i18n, auth, app toast host
 *
 * @history
 * - 2026-06-28 D2: I18nProvider
 */

import type { ReactNode } from 'react';
import { ThemeProvider } from '@gen-office/theme';
import { I18nProvider } from '../../i18n';
import { AuthProvider } from './AuthProvider';
import { AppToastProvider } from './AppToastProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultMode="light" storageKey="gen-office-demo-theme">
      <I18nProvider defaultLocale="ko">
        <AuthProvider>
          <AppToastProvider>{children}</AppToastProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
