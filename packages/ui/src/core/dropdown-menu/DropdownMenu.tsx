/**
 * @file packages/ui/src/core/dropdown-menu/DropdownMenu.tsx
 * @description Radix DropdownMenu compound primitives.
 * @created 2026-06-24
 */
import { forwardRef } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
} from './DropdownMenu.types';
import styles from './DropdownMenu.module.css';

// Main DropdownMenu Root (re-export)
export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// DropdownMenu Content
export const DropdownMenuContent = forwardRef<HTMLDivElement,DropdownMenuContentProps>(
  ({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={clsx(styles.content, className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// DropdownMenu Item
export const DropdownMenuItem = forwardRef<HTMLDivElement,DropdownMenuItemProps>(
  ({ className, children, icon, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={clsx(styles.item, className)}
    {...props}
  >
    {icon && <span className={styles.itemIcon}>{icon}</span>}
    {children}
  </DropdownMenuPrimitive.Item>
));

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// DropdownMenu Checkbox Item
export const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement,DropdownMenuCheckboxItemProps>(
  ({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={clsx(styles.checkboxItem, className)}
    checked={checked}
    {...props}
  >
    <span className={styles.itemIndicator}>
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className={styles.indicatorIcon} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));

DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

// DropdownMenu Radio Item
export const DropdownMenuRadioItem = forwardRef<HTMLDivElement,DropdownMenuRadioItemProps>(
  ({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={clsx(styles.radioItem, className)}
    {...props}
  >
    <span className={styles.itemIndicator}>
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className={styles.indicatorIcon} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// DropdownMenu Label
export const DropdownMenuLabel = forwardRef<HTMLDivElement,DropdownMenuLabelProps>(
({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={clsx(styles.label, className)}
    {...props}
  />
));

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// DropdownMenu Separator
export const DropdownMenuSeparator = forwardRef<HTMLDivElement,DropdownMenuSeparatorProps>(
  ({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={clsx(styles.separator, className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// DropdownMenu Sub Trigger
export const DropdownMenuSubTrigger = forwardRef< HTMLDivElement,DropdownMenuSubTriggerProps>(
  ({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={clsx(styles.subTrigger, className)}
    {...props}
  >
    {children}
    <ChevronRight className={styles.subTriggerIcon} />
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

// DropdownMenu Sub Content
export const DropdownMenuSubContent = forwardRef<HTMLDivElement,DropdownMenuSubContentProps>(
  ({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={clsx(styles.subContent, className)}
    {...props}
  />
));

DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

// DropdownMenu Shortcut (helper component)
export const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={clsx(styles.shortcut, className)}
      {...props}
    />
  );
};

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';