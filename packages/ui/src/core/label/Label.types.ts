/**
 * @file packages/ui/src/core/label/Label.types.ts
 * @description Public props for Label (Radix Label.Root).
 * @created 2026-06-23
 *
 * @remark
 * - required: appends asterisk via CSS module (not html required attribute)
 * - error: error text color via --color-status-error
 */
import type { ComponentPropsWithoutRef } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

export interface LabelProps
  extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  /** Shows required asterisk after label text */
  required?: boolean;
  /** Error state — label text uses status error color */
  error?: boolean;
}
