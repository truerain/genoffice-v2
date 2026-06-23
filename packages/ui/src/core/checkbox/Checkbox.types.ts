/**
 * @file packages/ui/src/core/checkbox/Checkbox.types.ts
 * @description Public props for Checkbox (Radix Checkbox.Root).
 * @created 2026-06-23
 *
 * @remark
 * - error: visual error border/background via --color-status-error
 * - Inherits checked/disabled/required from Radix Checkbox.Root
 */
import type { ComponentPropsWithoutRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

export interface CheckboxProps
  extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Error state — border and checked fill use status error color */
  error?: boolean;
}
