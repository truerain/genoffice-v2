/**
 * @file apps/demo/src/shared/api/types.ts
 * @description Shared API response and error types for @gen-office/demo.
 * @created 2026-06-28
 *
 * @remark
 * - Exports: ApiErrorBody, ApiError, LoginRequest, LoginResponse, SessionResponse
 *
 */

export interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(status: number, body: ApiErrorBody | null, message?: string) {
    super(message ?? body?.message ?? `Request failed (${status})`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username?: string;
  displayName?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  username?: string;
  displayName?: string;
}
