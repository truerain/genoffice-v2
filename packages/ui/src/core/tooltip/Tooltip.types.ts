/**
 * @file packages/ui/src/core/tooltip/Tooltip.types.ts
 * @description Public types for Tooltip compound primitives.
 * @created 2026-06-24
 */
import type * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

export interface TooltipProviderProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider> {}

export interface TooltipProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {}

export interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> {}

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {}
