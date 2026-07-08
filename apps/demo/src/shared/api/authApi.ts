/**
 * @file apps/demo/src/shared/api/authApi.ts
 * @description Login, logout, and session check API (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - 엔드포인트: /api/auth/login, /api/auth/logout, /api/auth/session
 * - dev mock은 MSW(authHandlers)가 네트워크를 가로챔
 *
 * @history
 * - 2026-07-08 데이터계층: in-code mock 분기 제거(MSW로 일원화)
 */

import { httpClient } from './httpClient';
import type { LoginRequest, LoginResponse, SessionResponse } from './types';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return httpClient.post<LoginResponse>('/api/auth/login', payload);
}

export async function logout(): Promise<void> {
  await httpClient.post('/api/auth/logout');
}

export async function checkSession(): Promise<SessionResponse> {
  return httpClient.get<SessionResponse>('/api/auth/session');
}
