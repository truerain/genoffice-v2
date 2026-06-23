/**
 * @file packages/ui/src/core/checkbox/Checkbox.tsx
 * @description Radix Checkbox primitive with checked indicator and error state.
 * @created 2026-06-23
 *
 * @remark
 * - @radix-ui/react-checkbox Root + lucide-react Check icon
 * - className merge via clsx (not @gen-office/utils cn)
 * - error prop toggles --color-status-error border/background
 */
import { forwardRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import type { CheckboxProps } from './Checkbox.types';
import styles from './Checkbox.module.css';

export const Checkbox = forwardRef<HTMLButtonElement,CheckboxProps>(
  ({ className, error = false, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={clsx(styles.root, error && styles.error, className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={styles.indicator}>
      <Check className={styles.icon} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
