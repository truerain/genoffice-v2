/**
 * @file packages/ui/src/core/popover/Popover.types.ts
 * @description Public props for Popover compound primitives.
 * @created 2026-06-24
 */
import type { ComponentPropsWithoutRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

export interface PopoverProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {}

export interface PopoverTriggerProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> {}

export interface PopoverContentProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {}
