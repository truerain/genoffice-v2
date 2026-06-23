/**
 * @file packages/ui/src/core/textarea/Textarea.types.ts
 * @description Public props for Textarea.
 * @created 2026-06-23
 */
import type { TextareaHTMLAttributes } from 'react';

export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  /** @default false */
  fullWidth?: boolean;
  /** @default 'vertical' */
  resize?: TextareaResize;
}
