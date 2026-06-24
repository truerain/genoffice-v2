/**
 * @file packages/ui/src/core/tabs/Tabs.tsx
 * @description Radix Tabs compound primitives with GenOffice variants.
 * @created 2026-06-24
 */
import { forwardRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { clsx } from 'clsx';
import type { TabsListProps, TabsTriggerProps, TabsContentProps } from './Tabs.types';
import styles from './Tabs.module.css';

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = 'pills', ...props }, ref) => {
    const variantClassName = {
      pills: styles.listPills,
      underline: styles.listUnderline,
      boxed: styles.listBoxed,
    }[variant];

    return (
      <TabsPrimitive.List
        ref={ref}
        className={clsx(styles.list, variantClassName, className)}
        {...props}
      />
    );
  }
);

TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={clsx(styles.trigger, className)}
    {...props}
  />
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, forceMount = true, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={clsx(styles.content, className)}
    forceMount={forceMount}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;
