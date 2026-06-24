/**
 * @file packages/ui/src/core/switch/Switch.tsx
 * @description Radix Switch primitive with thumb and error state.
 * @created 2026-06-23
 *
 * @remark
 * - @radix-ui/react-switch Root + Thumb
 * - className merge via clsx
 * - forwardRef to HTMLButtonElement (Radix Switch root)
 */
import { forwardRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { clsx } from 'clsx';
import type { SwitchProps } from './Switch.types';
import styles from './Switch.module.css';

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, error = false, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={clsx(styles.root, error && styles.error, className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={styles.thumb} />
    </SwitchPrimitive.Root>
  )
);

Switch.displayName = SwitchPrimitive.Root.displayName;
