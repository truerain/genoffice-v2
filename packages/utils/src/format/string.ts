/**
 * @file packages/utils/src/format/string.ts
 * @description String casing helpers (capitalize, kebab-case).
 * @created 2026-06-23
 *
 * @remark
 * - Exports: capitalize, toKebabCase
 */

/** 첫 글자만 대문자, 나머지는 소문자 */
export function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();
}

export function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}
