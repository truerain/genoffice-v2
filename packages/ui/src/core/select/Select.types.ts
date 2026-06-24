/**
 * @file packages/ui/src/core/select/Select.types.ts
 * @description Public props for Select compound primitives.
 * @created 2026-06-24
 */
import type { ComponentPropsWithoutRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

export interface SelectProps extends ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Helper text (description or error message) */
  helperText?: string;
  /** Error state */
  error?: boolean;
  /** Full width select @default false */
  fullWidth?: boolean;
}

export interface SelectTriggerProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** Error state */
  error?: boolean;
  /** Full width trigger */
  fullWidth?: boolean;
}

export interface SelectContentProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {}

export interface SelectItemProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {}

export interface SelectGroupProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Group> {}

export interface SelectLabelProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {}

export interface SelectSeparatorProps
  extends ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {}
