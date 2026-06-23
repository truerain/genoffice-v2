/**
 * @file packages/ui/src/core/badge/Badge.tsx
 * @description Status and label chip — native span with variant/size/dot styles.
 * @created 2026-06-23
 *
 * @remark
 * - No Radix primitive (CSS-only per migration-plan)
 * - forwardRef to HTMLSpanElement
 * - className merge via @gen-office/utils cn (V1 compat; migrate to clsx later)
 */
import { forwardRef } from 'react';
import { cn } from '@gen-office/utils';
import type { BadgeProps } from './Badge.types';
import styles from './Badge.module.css';

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      dot = false,
      children,
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        styles.badge,
        styles[variant],
        styles[size],
        dot && styles.withDot,
        className
      )}
      {...props}
    >
      {dot && <span className={styles.dot} aria-hidden />}
      {children}
    </span>
  )
);

Badge.displayName = 'Badge';
