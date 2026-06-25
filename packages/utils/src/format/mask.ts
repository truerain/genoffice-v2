/**
 * @file packages/utils/src/format/mask.ts
 * @description Domain-neutral fixed-slot mask engine for digit + literal patterns.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: MaskDefinition, MaskState, resolveMaskDefinition, createMaskState, formatDigits, extractDigits
 * - Presets: ymd, ym via maskPresets/date.ts
 */
import { ymMaskDefinition, ymdMaskDefinition } from './maskPresets/date';

export type MaskToken = { kind: 'digit' } | { kind: 'literal'; char: string };

export type MaskDefinition = {
  tokens: MaskToken[];
  maxDigits: number;
};

export type MaskState = {
  display: string;
  digits: string;
  complete: boolean;
};

export type MaskPresetId = 'ymd' | 'ym';

export type MaskSeparator = '-' | '/' | '.';

export type MaskPresetOptions = {
  preset: MaskPresetId;
  separator?: MaskSeparator;
};

export function resolveMaskDefinition(
  mask: MaskPresetId | MaskPresetOptions | MaskDefinition
): MaskDefinition {
  if (typeof mask === 'object' && 'tokens' in mask) {
    return mask;
  }

  if (typeof mask === 'string') {
    return resolveMaskPreset({ preset: mask });
  }

  return resolveMaskPreset(mask);
}

export function resolveMaskPreset(options: MaskPresetOptions): MaskDefinition {
  const separator = options.separator ?? '-';

  switch (options.preset) {
    case 'ym':
      return ymMaskDefinition(separator);
    case 'ymd':
    default:
      return ymdMaskDefinition(separator);
  }
}

export function extractDigits(value: string, maxDigits: number): string {
  return value.replace(/\D/g, '').slice(0, maxDigits);
}

export function formatDigits(digits: string, definition: MaskDefinition): string {
  const capped = digits.slice(0, definition.maxDigits);
  let digitIndex = 0;
  let display = '';

  for (const token of definition.tokens) {
    if (token.kind === 'digit') {
      if (digitIndex >= capped.length) {
        break;
      }
      display += capped[digitIndex];
      digitIndex += 1;
      continue;
    }

    if (digitIndex < capped.length) {
      display += token.char;
    }
  }

  return display;
}

export function createMaskState(digits: string, definition: MaskDefinition): MaskState {
  const normalized = digits.slice(0, definition.maxDigits);
  const display = formatDigits(normalized, definition);

  return {
    display,
    digits: normalized,
    complete: normalized.length === definition.maxDigits,
  };
}

export function createMaskStateFromDisplay(
  display: string,
  definition: MaskDefinition
): MaskState {
  return createMaskState(extractDigits(display, definition.maxDigits), definition);
}

export function appendDigit(
  digits: string,
  digit: string,
  definition: MaskDefinition
): MaskState {
  if (!/^\d$/.test(digit) || digits.length >= definition.maxDigits) {
    return createMaskState(digits, definition);
  }

  return createMaskState(`${digits}${digit}`, definition);
}

export function backspaceDigit(digits: string, definition: MaskDefinition): MaskState {
  return createMaskState(digits.slice(0, -1), definition);
}

export function applyPasteMask(
  _currentDigits: string,
  pasted: string,
  definition: MaskDefinition
): MaskState {
  return createMaskState(extractDigits(pasted, definition.maxDigits), definition);
}

export function isMaskComplete(digits: string, definition: MaskDefinition): boolean {
  return digits.length === definition.maxDigits;
}
