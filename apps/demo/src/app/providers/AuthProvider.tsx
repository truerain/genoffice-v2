/**
 * @file apps/demo/src/app/providers/AuthProvider.tsx
 * @description Session auth via authApi with mock fallback (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: AuthProvider, useAuth
 * - checkSession on mount
 *
 * @history
 * - 2026-06-28 D2: authApi integration
 * - 2026-06-28 D1: sessionStorage mock only
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from '../../shared/api/authApi';
import type { LoginRequest } from '../../shared/api/types';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const session = await authApi.checkSession();
        if (!cancelled) {
          setIsAuthenticated(session.authenticated);
          setUsername(session.username ?? null);
        }
      } catch {
        if (!cancelled) {
          setIsAuthenticated(false);
          setUsername(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const response = await authApi.login(payload);
    setIsAuthenticated(true);
    setUsername(response.username ?? payload.username);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, username, login, logout }),
    [isAuthenticated, isLoading, username, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
