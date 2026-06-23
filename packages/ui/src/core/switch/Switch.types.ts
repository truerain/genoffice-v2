/**
 * @file packages/ui/src/core/switch/Switch.types.ts
 * @description Public props for Switch (Radix Switch.Root).
 * @created 2026-06-23
 *
 * @remark
 * - error: visual error track color via --color-status-error
 * - Inherits checked/disabled/required from Radix Switch.Root
 */
import type { ComponentPropsWithoutRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

export interface SwitchProps
  extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  /** Error state — track uses status error color */
  error?: boolean;
}
