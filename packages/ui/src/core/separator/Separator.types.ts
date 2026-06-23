/**
 * @file packages/ui/src/core/separator/Separator.types.ts
 * @description Public props for Separator (Radix Separator.Root).
 * @created 2026-06-23
 *
 * @remark
 * - variant maps to theme border semantic tokens (subtle / default / strong)
 * - orientation, decorative: Radix Separator.Root props
 */
import type { ComponentPropsWithoutRef } from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

export type SeparatorVariant = 'subtle' | 'default' | 'strong';

export interface SeparatorProps
  extends ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /** Border emphasis — theme --color-border-* */
  variant?: SeparatorVariant;
}
