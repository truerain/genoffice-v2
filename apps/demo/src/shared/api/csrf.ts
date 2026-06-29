/**
 * @file apps/demo/src/shared/api/csrf.ts
 * @description CSRF token read/attach policy for mutating HTTP requests (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Cookie name: XSRF-TOKEN (Spring-style)
 * - Header: X-XSRF-TOKEN
 *
 */

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';

let cachedToken: string | null = null;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getCsrfToken(): string | null {
  if (cachedToken) return cachedToken;
  cachedToken = readCookie(CSRF_COOKIE_NAME);
  return cachedToken;
}

export function setCsrfToken(token: string | null): void {
  cachedToken = token;
}

export function isMutatingMethod(method?: string): boolean {
  const normalized = (method ?? 'GET').toUpperCase();
  return normalized === 'POST' || normalized === 'PUT' || normalized === 'PATCH' || normalized === 'DELETE';
}

export function applyCsrfHeader(headers: Headers, method?: string): void {
  if (!isMutatingMethod(method)) return;
  const token = getCsrfToken();
  if (token) {
    headers.set(CSRF_HEADER_NAME, token);
  }
}
