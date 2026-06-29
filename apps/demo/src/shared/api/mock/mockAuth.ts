/**
 * @file apps/demo/src/shared/api/mock/mockAuth.ts
 * @description Mock auth session for backend-less demo development (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - sessionStorage key: gen-office-demo-mock-auth
 *
 */

import type { LoginRequest, LoginResponse, SessionResponse } from '../types';

const STORAGE_KEY = 'gen-office-demo-mock-auth';

interface StoredSession {
  username: string;
  displayName: string;
}

function readSession(): StoredSession | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function writeSession(session: StoredSession | null): void {
  if (typeof sessionStorage === 'undefined') return;
  if (!session) {
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export async function mockLogin(payload: LoginRequest): Promise<LoginResponse> {
  const username = payload.username.trim() || 'demo';
  const session: StoredSession = {
    username,
    displayName: username,
  };
  writeSession(session);
  return { username: session.username, displayName: session.displayName };
}

export async function mockLogout(): Promise<void> {
  writeSession(null);
}

export async function mockCheckSession(): Promise<SessionResponse> {
  const session = readSession();
  if (!session) {
    return { authenticated: false };
  }
  return {
    authenticated: true,
    username: session.username,
    displayName: session.displayName,
  };
}

export function readMockAuthenticated(): boolean {
  return readSession() !== null;
}
