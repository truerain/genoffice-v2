// packages/gen-datagrid/src/features/editing/editValuePipeline.ts
// Normalizes inbound editor values from column meta across typing, paste, and commit paths.

import type {
  GenDataGridBuiltinEditType,
  GenDataGridColumnMeta,
  GenDataGridEditableContext,
  GenDataGridEditEmptyOption,
  GenDataGridEditOption,
  GenDataGridEditPattern,
  GenDataGridEditPatternPreset,
  GenDataGridEditType,
  GenDataGridEditTypePreset,
} from '../../GenDataGrid.types';
import { resolveEditLookupConfig } from './resolveEditLookup';

const EDIT_TYPE_PRESETS = new Set<GenDataGridEditTypePreset>([
  'lowercaseText',
  'uppercaseText',
  'digitsOnly',
  'alphanumeric',
]);

const EDIT_PATTERN_PRESETS: Record<GenDataGridEditPatternPreset, RegExp> = {
  digitsOnly: /^\d*$/,
  alphanumeric: /^[a-zA-Z0-9]*$/,
  lettersOnly: /^[a-zA-Z]*$/,
};

export function isGenDataGridEditTypePreset(
  editType?: GenDataGridEditType
): editType is GenDataGridEditTypePreset {
  return editType != null && EDIT_TYPE_PRESETS.has(editType as GenDataGridEditTypePreset);
}

export function resolveInputEditType(
  editType?: GenDataGridEditType
): GenDataGridBuiltinEditType | undefined {
  if (!editType || editType === 'lookup' || isGenDataGridEditTypePreset(editType)) {
    if (editType === 'lookup') {
      return undefined;
    }
    return 'text';
  }
  return editType;
}

function toEditableString(value: unknown): string {
  if (value == null) return '';
  return String(value);
}

export function normalizeLowercase(value: unknown): string {
  return toEditableString(value).toLowerCase();
}

export function normalizeUppercase(value: unknown): string {
  return toEditableString(value).toUpperCase();
}

export function normalizeDigitsOnly(value: unknown): string {
  return toEditableString(value).replace(/\D/g, '');
}

export function normalizeAlphanumeric(value: unknown): string {
  return toEditableString(value).replace(/[^a-zA-Z0-9]/g, '');
}

export function normalizeMaxLength(value: string, maxLength: number): string {
  if (maxLength < 0) return value;
  return value.slice(0, maxLength);
}

/**
 * Resolve `editPattern` meta to a RegExp (Gate 4.3-c).
 */
export function resolveEditPattern(pattern?: GenDataGridEditPattern): RegExp | undefined {
  if (!pattern) return undefined;
  if (pattern instanceof RegExp) return pattern;
  return EDIT_PATTERN_PRESETS[pattern];
}

/**
 * Empty string is always allowed so users can clear the field.
 * Non-empty values must fully match the resolved pattern.
 */
export function matchesEditPattern(value: string, pattern: RegExp): boolean {
  if (value === '') return true;
  return pattern.test(value);
}

/**
 * Resolve select options with optional empty/clearable leading option (Gate 4.3-b).
 */
export function resolveSelectEditOptions(
  options: readonly GenDataGridEditOption[] | undefined,
  meta?: {
    editEmptyOption?: GenDataGridEditEmptyOption;
    editSelectClearable?: boolean;
  }
): GenDataGridEditOption[] {
  const base = options ? [...options] : [];
  const emptyMeta = meta?.editEmptyOption;
  const clearable = Boolean(meta?.editSelectClearable);

  if (!emptyMeta && !clearable) {
    return base;
  }

  const emptyOption: GenDataGridEditOption = emptyMeta
    ? { label: emptyMeta.label, value: emptyMeta.value ?? '' }
    : { label: '', value: '' };

  const emptyKey = String(emptyOption.value);
  if (base.some((option) => String(option.value) === emptyKey)) {
    return base;
  }

  return [emptyOption, ...base];
}

function resolvePresetNormalize(
  editType?: GenDataGridEditType
): ((value: unknown) => unknown) | undefined {
  switch (editType) {
    case 'lowercaseText':
      return normalizeLowercase;
    case 'uppercaseText':
      return normalizeUppercase;
    case 'digitsOnly':
      return normalizeDigitsOnly;
    case 'alphanumeric':
      return normalizeAlphanumeric;
    default:
      return undefined;
  }
}

function supportsTextEditMeta(inputEditType?: GenDataGridBuiltinEditType): boolean {
  return inputEditType === 'text' || inputEditType === 'textarea';
}

export type GenDataGridEditValueHandlers<TData> = {
  inputEditType: GenDataGridBuiltinEditType | undefined;
  maxLength?: number;
  trimOnCommit: boolean;
  pattern?: RegExp;
  applyInbound: (rawValue: unknown, previousValue?: unknown) => unknown;
  applyCommit: (rawValue: unknown, previousValue?: unknown) => unknown;
};

export function createEditValueHandlers<TData>({
  meta,
  editableContext,
}: {
  meta?: GenDataGridColumnMeta<TData>;
  editableContext: GenDataGridEditableContext<TData>;
}): GenDataGridEditValueHandlers<TData> {
  const lookupConfig = resolveEditLookupConfig(meta);
  if (lookupConfig && !lookupConfig.allowCellEdit) {
    return {
      inputEditType: undefined,
      trimOnCommit: false,
      applyInbound: (rawValue) => rawValue,
      applyCommit: (rawValue) => rawValue,
    };
  }

  const inputEditType = lookupConfig?.allowCellEdit
    ? 'text'
    : resolveInputEditType(meta?.editType);
  const presetNormalize = resolvePresetNormalize(meta?.editType);
  const customNormalize = meta?.editNormalize;
  const maxLength =
    supportsTextEditMeta(inputEditType) && meta?.editMaxLength != null
      ? meta.editMaxLength
      : undefined;
  const trimOnCommit = Boolean(
    supportsTextEditMeta(inputEditType) && meta?.editTrimOnCommit
  );
  const pattern =
    supportsTextEditMeta(inputEditType) && meta?.editPattern != null
      ? resolveEditPattern(meta.editPattern)
      : undefined;

  const applyInbound = (rawValue: unknown, previousValue?: unknown) => {
    let next = rawValue;
    if (presetNormalize) {
      next = presetNormalize(next);
    }
    if (customNormalize) {
      next = customNormalize(next, editableContext);
    }
    if (maxLength != null) {
      next = normalizeMaxLength(toEditableString(next), maxLength);
    }
    if (pattern && !matchesEditPattern(toEditableString(next), pattern)) {
      if (previousValue !== undefined) {
        return previousValue;
      }
      return '';
    }
    return next;
  };

  const applyCommit = (rawValue: unknown, previousValue: unknown = rawValue) => {
    let next = applyInbound(rawValue, previousValue);
    if (trimOnCommit && typeof next === 'string') {
      next = next.trim();
    }
    return next;
  };

  return {
    inputEditType,
    maxLength,
    trimOnCommit,
    pattern,
    applyInbound,
    applyCommit,
  };
}
