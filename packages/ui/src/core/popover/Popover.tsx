/**
 * @file packages/ui/src/core/popover/Popover.tsx
 * @description Radix Popover compound primitives.
 * @created 2026-06-24
 */
import { forwardRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { clsx } from 'clsx';
import type { PopoverContentProps } from './Popover.types';
import styles from './Popover.module.css';

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverPortal = PopoverPrimitive.Portal;

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, sideOffset = 6, ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={clsx(styles.content, className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;
