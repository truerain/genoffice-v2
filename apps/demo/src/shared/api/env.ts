/**
 * @file apps/demo/src/shared/api/env.ts
 * @description Vite env helpers for API and mock toggles (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - VITE_USE_MOCK_AUTH / VITE_USE_MOCK_MENU default true when unset
 * - VITE_API_BASE_URL default http://localhost:8080
 *
 */

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
}

export function useMockAuth(): boolean {
  return import.meta.env.VITE_USE_MOCK_AUTH !== 'false';
}

export function useMockMenu(): boolean {
  return import.meta.env.VITE_USE_MOCK_MENU !== 'false';
}
