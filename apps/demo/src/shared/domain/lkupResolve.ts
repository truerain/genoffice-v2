/**
 * @file apps/demo/src/shared/domain/lkupResolve.ts
 * @description Helpers to resolve lookup codes for grid display and editors.
 * @created 2026-07-09
 */

import type { Lkup } from './lkup.types';

export type LkupSelectOption = {
  label: string;
  value: string;
};

export function lkupNameByCd(codes: readonly Lkup[], lkupCd?: string): string {
  if (!lkupCd) return '';
  return codes.find((code) => code.lkupCd === lkupCd)?.lkupName ?? '';
}

export function toLkupEditOptions(
  codes: readonly Lkup[],
  includeEmpty = true,
): LkupSelectOption[] {
  const options = codes.map((code) => ({
    label: code.lkupName,
    value: code.lkupCd,
  }));
  return includeEmpty ? [{ label: '', value: '' }, ...options] : options;
}
