/**
 * @file packages/ui/src/core/toast/Toast.types.ts
 * @description Public types for Toast compound primitives.
 * @created 2026-06-24
 */
import type * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';

export type ToastVariant = 'default' | 'success' | 'warning' | 'error';

export interface ToastProviderProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Provider> {}

export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport> {
  /**
   * Portal the viewport to `document.body`.
   * Use when toasts must escape overflow/transform ancestors (e.g. Storybook canvas, modals).
   * @default false
   */
  portalled?: boolean;
}

export interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  /**
   * Visual tone for the toast surface.
   * @default 'default'
   */
  variant?: ToastVariant;
}

export interface ToastTitleProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title> {}

export interface ToastDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description> {}

export interface ToastActionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action> {}

export interface ToastCloseProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close> {}
