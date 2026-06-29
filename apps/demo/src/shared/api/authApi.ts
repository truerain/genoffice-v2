/**
 * @file apps/demo/src/shared/api/authApi.ts
 * @description Login, logout, and session check API (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Mock when VITE_USE_MOCK_AUTH !== false
 * - Real: /api/auth/login, /api/auth/logout, /api/auth/session
 *
 */

import { useMockAuth } from './env';
import { httpClient } from './httpClient';
import { mockCheckSession, mockLogin, mockLogout } from './mock/mockAuth';
import type { LoginRequest, LoginResponse, SessionResponse } from './types';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  if (useMockAuth()) {
    return mockLogin(payload);
  }
  return httpClient.post<LoginResponse>('/api/auth/login', payload);
}

export async function logout(): Promise<void> {
  if (useMockAuth()) {
    await mockLogout();
    return;
  }
  await httpClient.post('/api/auth/logout');
}

export async function checkSession(): Promise<SessionResponse> {
  if (useMockAuth()) {
    return mockCheckSession();
  }
  return httpClient.get<SessionResponse>('/api/auth/session');
}
