/**
 * @file apps/demo/src/shared/api/env.ts
 * @description Vite env helpers for API and mock toggles (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - MSW: dev에서 VITE_ENABLE_MSW !== 'false'면 mock 백엔드 기동
 * - VITE_API_BASE_URL default http://localhost:8080
 *
 * @history
 * - 2026-07-08 데이터계층: useMockAuth/useMockMenu 제거 → isMswEnabled (MSW 일원화)
 */

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
}

export function isMswEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false';
}
