/**
 * @file packages/ui/src/core/radio/Radio.types.ts
 * @description Public props for RadioGroup and Radio (Radix radio-group).
 * @created 2026-06-23
 *
 * @remark
 * - error on RadioGroup: group-level visual state hook (reserved for composed forms)
 * - error on Radio: per-item border/indicator uses --color-status-error
 */
import type { ComponentPropsWithoutRef } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

export interface RadioGroupProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /** Group-level error state (layout hook for composed forms) */
  error?: boolean;
}

export interface RadioProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /** Error state — border and indicator use status error color */
  error?: boolean;
}
