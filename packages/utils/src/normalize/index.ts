/**
 * @file packages/utils/src/normalize/index.ts
 * @description Form field normalization (trim, Y/N codes, sort order) for back-office payloads.
 * @created 2026-06-23
 *
 * @remark
 * - Exports: normalize, normalizeNullable, normalizeUppercode, normalizeYesNo, normalizeSortOrder
 * - Defaults: normalizeWithDefault, normalizeUseYnWithDefault (wraps normalizeYesNo)
 * - normalizeYesNo throws on invalid Y/N; normalizeUseYnWithDefault falls back to default
 * - Defaults: normalizeWithDefault, normalizeUseYnWithDefault (wraps normalizeYesNo)
 * - normalizeYesNo throws on invalid Y/N; normalizeUseYnWithDefault falls back to default
 * - normalizeSortOrder uses validateNonNegativeNumber from validation/business
 * - V1 name normalizeUseYn lives in ./normalize.v1
 */
import { validateNonNegativeNumber } from '../validation/business';
import { assertYesNoCode } from '../validation/yesNo';

export const normalize = (value: unknown): string => {
  return String(value ?? '').trim();
};

export const normalizeNullable = (value: unknown): string | null => {
  const v = normalize(value);
  return v === '' ? null : v;
};

export const normalizeUppercode = (value: unknown): string => {
  return normalize(value)
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '');
};

export const normalizeYesNo = (value: unknown): 'Y' | 'N' => {
  return assertYesNoCode(normalize(value));
};

export const normalizeSortOrder = (value: unknown): number | null => {
  const v = normalize(value);
  if (!v) return null;

  const num = Number(v);
  validateNonNegativeNumber(num, 'sortOrder');
  return num;
};

export const normalizeWithDefault = (value: unknown, defaultValue: string): string => {
  const v = normalize(value);
  return v === '' ? defaultValue : v;
};

export const normalizeUseYnWithDefault = (
  value: unknown,
  defaultValue: 'Y' | 'N' = 'Y',
): 'Y' | 'N' => {
  try {
    return normalizeYesNo(value);
  } catch {
    return defaultValue;
  }
};
