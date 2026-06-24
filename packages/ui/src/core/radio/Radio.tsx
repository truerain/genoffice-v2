/**
 * @file packages/ui/src/core/radio/Radio.tsx
 * @description Radix RadioGroup Root and Radio Item primitives.
 * @created 2026-06-23
 *
 * @remark
 * - Exports: RadioGroup, Radio
 * - forwardRef: HTMLDivElement (group), HTMLButtonElement (item)
 */
import { forwardRef } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { clsx } from 'clsx';
import type { RadioGroupProps, RadioProps } from './Radio.types';
import styles from './Radio.module.css';

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, error: _groupError = false, ...props }, ref) => (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={clsx(styles.group, className)}
      {...props}
    />
  )
);

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  ({ className, error = false, ...props }, ref) => (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={clsx(styles.item, error && styles.error, className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className={styles.indicator}>
        <Circle className={styles.icon} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
);

Radio.displayName = RadioGroupPrimitive.Item.displayName;
