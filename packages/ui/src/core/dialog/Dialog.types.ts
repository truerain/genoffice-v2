/**
 * @file packages/ui/src/core/dialog/Dialog.types.ts
 * @description Public props for Dialog compound primitives.
 * @created 2026-06-23
 */
import type { ComponentPropsWithoutRef, HTMLAttributes } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export interface DialogProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {}

export interface DialogTriggerProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {}

export interface DialogPortalProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Portal> {}

export interface DialogOverlayProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

export interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Show close button @default true */
  showClose?: boolean;
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {}

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

export interface DialogTitleProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

export interface DialogDescriptionProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}
