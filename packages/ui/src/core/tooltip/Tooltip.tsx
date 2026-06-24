/**
 * @file packages/ui/src/core/tooltip/Tooltip.tsx
 * @description Radix Tooltip compound primitives.
 * @created 2026-06-24
 */
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { clsx } from 'clsx';
import type { TooltipContentProps } from './Tooltip.types';
import styles from './Tooltip.module.css';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipPortal = TooltipPrimitive.Portal;

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={clsx(styles.content, className)}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
);

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export const TooltipArrow = forwardRef<
  SVGSVGElement,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow ref={ref} className={clsx(styles.arrow, className)} {...props} />
));

TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;
