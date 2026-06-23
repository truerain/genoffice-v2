/**
 * @file packages/utils/src/validation/business.ts
 * @description Back-office field validators that throw on invalid API/form values.
 * @created 2026-06-23
 *
 * @remark
 * - Throws Error with English message (field name interpolated)
 * - Exports: validateNoWhitespace, validateUppercaseCode, validateYesNo, validateNonNegativeNumber, validateRequired
 * - Used by normalize (sortOrder) and form/API save paths
 * - validateYesNo delegates to ./yesNo assertYesNoCode
 */

import { assertYesNoCode } from './yesNo';

export const validateNoWhitespace = (value: string, field: string): void => {
  if (/\s/.test(value)) {
    throw new Error(`${field} should not contain whitespace.`);
  }
};

export const validateUppercaseCode = (value: string, field: string): void => {
  if (!/^[A-Z0-9_]+$/.test(value)) {
    throw new Error(`${field} should contain only uppercase letters, numbers, or underscores.`);
  }
};

export const validateYesNo = (value: string, field: string = 'useYn'): void => {
  assertYesNoCode(value, field);
};

export const validateNonNegativeNumber = (value: number, field: string): void => {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${field} should be a non-negative number.`);
  }
};

export const validateRequired = (value: string, field: string): void => {
  if (!value || value.trim() === '') {
    throw new Error(`${field} is required.`);
  }
};
