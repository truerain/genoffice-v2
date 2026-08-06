/**
 * @file apps/demo/src/app/login/LoginPage.tsx
 * @description Login screen — authApi or mock (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - DEV 스모크: `@gen-office/debug` 훅 (상태·렌더 관찰)
 *
 * @history
 * - 2026-08-06 @gen-office/debug 스모크 훅 연결
 * - 2026-06-28 D2: username/password form + authApi
 */

import { useState, type FormEvent } from 'react';
import {
  useDebugState,
  useRenderCount,
  useWhyRender,
} from '@gen-office/debug';
import { Button, Input, Label } from '@gen-office/ui';
import { DemoSurface } from '../../shared/components/DemoSurface';
import { useAuth } from '../providers/AuthProvider';
import { useI18n } from '../../i18n';
import styles from './LoginPage.module.css';

const debugEnabled = import.meta.env.DEV;

export function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useRenderCount('LoginPage', { enabled: debugEnabled, log: true });
  useDebugState('Login.username', username, { enabled: debugEnabled });
  useWhyRender(
    'LoginPage',
    { username, password, isSubmitting, error },
    { enabled: debugEnabled },
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await login({ username, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.screen}>
      <DemoSurface as="form" variant="elevated" className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>{t('auth.loginTitle')}</h1>
        <p className={styles.subtitle}>{t('auth.loginSubtitle')}</p>
        <div className={styles.field}>
          <Label htmlFor="username">{t('auth.username')}</Label>
          <Input
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </div>
        <div className={styles.field}>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error ? <p className={styles.error}>{error}</p> : null}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {t('auth.loginButton')}
        </Button>
      </DemoSurface>
    </div>
  );
}
