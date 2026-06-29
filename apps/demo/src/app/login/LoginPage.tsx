/**
 * @file apps/demo/src/app/login/LoginPage.tsx
 * @description Mock login screen for demo (Gate D1).
 * @created 2026-06-28
 *
 * @remark
 * - D2: authApi + real session
 *
 */

import { Button } from '@gen-office/ui';
import { useAuth } from '../providers/AuthProvider';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { login } = useAuth();

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.title}>GenOffice V2 Demo</h1>
        <p className={styles.subtitle}>Mock login — no backend required for D1.</p>
        <Button type="button" variant="primary" onClick={login}>
          로그인 (Mock)
        </Button>
      </div>
    </div>
  );
}
