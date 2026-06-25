/**
 * @file packages/utils/src/format/maskPresets/date.ts
 * @description Date-oriented mask preset definitions (ymd, ym).
 * @created 2026-06-25
 *
 * @remark
 * - Domain-neutral token layout; no Date parse/format
 * - separator values align with DateYmdSeparator used by parseDateString consumers
 */
import type { MaskDefinition, MaskSeparator } from '../mask';

export function ymdMaskDefinition(separator: MaskSeparator = '-'): MaskDefinition {
  return {
    tokens: [
      { kind: 'digit' },
      { kind: 'digit' },
      { kind: 'digit' },
      { kind: 'digit' },
      { kind: 'literal', char: separator },
      { kind: 'digit' },
      { kind: 'digit' },
      { kind: 'literal', char: separator },
      { kind: 'digit' },
      { kind: 'digit' },
    ],
    maxDigits: 8,
  };
}

export function ymMaskDefinition(separator: MaskSeparator = '-'): MaskDefinition {
  return {
    tokens: [
      { kind: 'digit' },
      { kind: 'digit' },
      { kind: 'digit' },
      { kind: 'digit' },
      { kind: 'literal', char: separator },
      { kind: 'digit' },
      { kind: 'digit' },
    ],
    maxDigits: 6,
  };
}
