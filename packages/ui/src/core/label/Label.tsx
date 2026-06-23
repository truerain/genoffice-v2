/**
 * @file packages/ui/src/core/label/Label.tsx
 * @description Radix Label primitive with required and error presentation states.
 * @created 2026-06-23
 *
 * @remark
 * - @radix-ui/react-label Root + forwardRef to HTMLLabelElement
 * - className merge via @gen-office/utils cn (V1 compat; migrate to clsx later)
 * - Tokens: --color-fg-primary, --color-status-error, --font-family-primary
 */
import { forwardRef } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@gen-office/utils';
import type { LabelProps } from './Label.types';
import styles from './Label.module.css';

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required = false, error = false, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        styles.root,
        error && styles.error,
        required && styles.required,
        className
      )}
      {...props}
    >
      {children}
      {required && <span className={styles.requiredMark}>*</span>}
    </LabelPrimitive.Root>
  )
);

Label.displayName = LabelPrimitive.Root.displayName;
