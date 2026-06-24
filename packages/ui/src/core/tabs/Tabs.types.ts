/**
 * @file packages/ui/src/core/tabs/Tabs.types.ts
 * @description Public types for Tabs compound primitives.
 * @created 2026-06-24
 */
import type * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}

export type TabsListVariant = 'pills' | 'underline' | 'boxed';

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /**
   * Visual style for the tab list.
   * @default 'pills'
   */
  variant?: TabsListVariant;
}

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {}

export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {}
