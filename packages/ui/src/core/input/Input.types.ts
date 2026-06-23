/**
 * @file packages/ui/src/core/input/Input.types.ts
 * @description Public props for Input.
 * @created 2026-06-23
 */
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional field label (renders Radix Label.Root) */
  label?: string;
  /** Description or error message below the field */
  helperText?: string;
  /** Error state — border, label, aria-invalid */
  error?: boolean;
  /** @default false */
  fullWidth?: boolean;
  suffix?: ReactNode;
  suffixClassName?: string;
  /** Show clear control when the field has a value */
  clearable?: boolean;
  clearLabel?: string;
  onClear?: () => void;
  /** Select all text on focus @default true */
  autoSelect?: boolean;
  prefixContent?: ReactNode;
  prefixClassName?: string;
}
