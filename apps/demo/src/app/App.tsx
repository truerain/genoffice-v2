/**
 * @file apps/demo/src/app/App.tsx
 * @description Root app — auth branch and authenticated shell.
 * @created 2026-06-28
 *
 * @remark
 * - Unauthenticated: LoginPage; authenticated: AppShell + MDI
 *
 * @history
 * - 2026-06-28 D2: auth loading gate
 * - 2026-06-28 D1: auth branch, AppShell
 */

import { useAuth } from './providers/AuthProvider';
import { LoginPage } from './login/LoginPage';
import { AppShell } from './AppShell';
import { useI18n } from '../i18n';

export function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useI18n();

  if (isLoading) {
    return <p style={{ padding: 24 }}>{t('common.loading')}</p>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AppShell />;
}
