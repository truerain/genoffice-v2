/**
 * @file packages/utils/src/validation/yesNo.ts
 * @description Shared Y/N code parsing and assertion for normalize and validators.
 * @created 2026-06-23
 *
 * @remark
 * - Internal helper; not re-exported from package barrel
 * - Used by normalizeYesNo and validateYesNo
 */
export type YesNoCode = 'Y' | 'N';

export const assertYesNoCode = (value: string, field?: string): YesNoCode => {
  const normalized = value.toUpperCase();
  if (normalized !== 'Y' && normalized !== 'N') {
    throw new Error(
      field
        ? `${field} should be either 'Y' or 'N'.`
        : `Value should be either 'Y' or 'N'.`,
    );
  }

  return normalized;
};
