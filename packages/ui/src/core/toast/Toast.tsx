/**
 * @file packages/ui/src/core/toast/Toast.tsx
 * @description Radix Toast compound primitives.
 * @created 2026-06-24
 */
import { forwardRef } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { clsx } from 'clsx';
import type {
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastProps,
  ToastTitleProps,
  ToastViewportProps,
} from './Toast.types';
import styles from './Toast.module.css';

const variantClassName = {
  default: styles.variantDefault,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  error: styles.variantError,
} as const;

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = forwardRef<HTMLOListElement, ToastViewportProps>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Viewport
      ref={ref}
      className={clsx(styles.viewport, className)}
      {...props}
    />
  )
);

ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

export const Toast = forwardRef<HTMLLIElement, ToastProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={clsx(styles.toast, variantClassName[variant], className)}
      {...props}
    />
  )
);

Toast.displayName = ToastPrimitive.Root.displayName;

export const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Title ref={ref} className={clsx(styles.title, className)} {...props} />
  )
);

ToastTitle.displayName = ToastPrimitive.Title.displayName;

export const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Description
      ref={ref}
      className={clsx(styles.description, className)}
      {...props}
    />
  )
);

ToastDescription.displayName = ToastPrimitive.Description.displayName;

export const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Action ref={ref} className={clsx(styles.action, className)} {...props} />
  )
);

ToastAction.displayName = ToastPrimitive.Action.displayName;

export const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, children = '×', ...props }, ref) => (
    <ToastPrimitive.Close ref={ref} className={clsx(styles.close, className)} {...props}>
      {children}
    </ToastPrimitive.Close>
  )
);

ToastClose.displayName = ToastPrimitive.Close.displayName;
