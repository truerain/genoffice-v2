/**
 * @file packages/ui/src/core/dropdown-menu/DropdownMenu.types.ts
 * @description Public props for DropdownMenu compound primitives.
 * @created 2026-06-24
 */
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

export interface DropdownMenuProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> {}

export interface DropdownMenuTriggerProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> {}

export interface DropdownMenuContentProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {}

export interface DropdownMenuItemProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** Icon to display before the item text */
  icon?: ReactNode;
}

export interface DropdownMenuCheckboxItemProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> {}

export interface DropdownMenuRadioItemProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> {}

export interface DropdownMenuLabelProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {}

export interface DropdownMenuSeparatorProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {}

export interface DropdownMenuGroupProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group> {}

export interface DropdownMenuSubProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Sub> {}

export interface DropdownMenuSubTriggerProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> {}

export interface DropdownMenuSubContentProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> {}

export interface DropdownMenuRadioGroupProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup> {}

export type DropdownMenuShortcutProps = HTMLAttributes<HTMLSpanElement>;
