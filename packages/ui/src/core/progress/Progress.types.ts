/**
 * @file packages/ui/src/core/progress/Progress.types.ts
 * @description Public types for Progress component.
 * @created 2026-06-24
 */
import type * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

export type ProgressVariant = 'default' | 'success' | 'warning' | 'error';

export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /**
   * Visual tone for the indicator bar.
   * @default 'default'
   */
  variant?: ProgressVariant;
  /**
   * Track height preset.
   * @default 'md'
   */
  size?: ProgressSize;
}
