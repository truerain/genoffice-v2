/**
 * @file apps/demo/src/mocks/handlers/authHandlers.ts
 * @description MSW handlers for session auth (login/logout/session).
 * @created 2026-07-08
 *
 * @remark
 * - sessionStorage 기반 mock 세션(구 shared/api/mock/mockAuth 이관)
 * - key: gen-office-demo-mock-auth
 *
 */

import { http, HttpResponse } from 'msw';
import { getApiBaseUrl } from '../../shared/api/env';
import type { LoginRequest } from '../../shared/api/types';

const STORAGE_KEY = 'gen-office-demo-mock-auth';
const base = getApiBaseUrl().replace(/\/$/, '');

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

export const authHandlers = [
  http.post(`${base}/api/auth/login`, async ({ request }) => {
    const payload = (await request.json()) as LoginRequest;
    const username = payload.username.trim() || 'demo';
    const session: StoredSession = { username, displayName: username };
    writeSession(session);
    return HttpResponse.json({ username, displayName: username });
  }),

  http.post(`${base}/api/auth/logout`, () => {
    writeSession(null);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${base}/api/auth/session`, () => {
    const session = readSession();
    if (!session) {
      return HttpResponse.json({ authenticated: false });
    }
    return HttpResponse.json({
      authenticated: true,
      username: session.username,
      displayName: session.displayName,
    });
  }),
];
