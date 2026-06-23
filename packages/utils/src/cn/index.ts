/**
 * @file packages/utils/src/cn/index.ts
 * @description Class name merge helper (clsx wrapper) for conditional CSS Modules usage.
 * @created 2026-06-23
 *
 * @remark
 * - V1 compat only (clsx thin wrapper); ui/mdi 이식 시 기존 `cn` import 유지용
 * - V2 신규·수정 코드: 각 패키지에서 `clsx` 직접 사용 (utils `cn` 추가/export 금지)
 * - Depends on clsx (runtime dependency of @gen-office/utils)
 */
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
