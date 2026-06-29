/**
 * @file apps/demo/src/app/App.tsx
 * @description Root app — auth branch and authenticated shell (Gate D1).
 * @created 2026-06-28
 *
 * @remark
 * - Unauthenticated: LoginPage; authenticated: AppShell + MDI
 *
 * @history
 * - 2026-06-28 D1: auth branch, AppShell
 * - 2026-06-28 D0: placeholder only
 */

import { useAuth } from './providers/AuthProvider';
import { LoginPage } from './login/LoginPage';
import { AppShell } from './AppShell';

export function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AppShell />;
}
