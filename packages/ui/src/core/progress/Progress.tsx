/**
 * @file packages/ui/src/core/progress/Progress.tsx
 * @description Radix Progress bar with theme variants.
 * @created 2026-06-24
 */
import { forwardRef } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { clsx } from 'clsx';
import type { ProgressProps } from './Progress.types';
import styles from './Progress.module.css';

const variantClassName = {
  default: styles.variantDefault,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  error: styles.variantError,
} as const;

const sizeClassName = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant = 'default', size = 'md', value, max = 100, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={clsx(
        styles.root,
        variantClassName[variant],
        sizeClassName[size],
        className
      )}
      value={value}
      max={max}
      {...props}
    >
      <ProgressPrimitive.Indicator className={styles.indicator} />
    </ProgressPrimitive.Root>
  )
);

Progress.displayName = ProgressPrimitive.Root.displayName;
