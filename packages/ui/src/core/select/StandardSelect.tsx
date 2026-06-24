/**
 * @file packages/ui/src/core/select/StandardSelect.tsx
 * @description Back-office default select — options/groups API over Select primitives.
 * @created 2026-06-24
 *
 * @remark
 * - Apps use StandardSelect; custom layouts use Select compound parts
 */
import { forwardRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from './Select';
import type { SelectProps as RadixSelectProps } from './Select.types';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface StandardSelectProps extends Omit<RadixSelectProps, 'children'> {
  /** ID for the select trigger (used with Label htmlFor) */
  id?: string;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Simple options array (mutually exclusive with groups) */
  options?: SelectOption[];
  /** Grouped options (mutually exclusive with options) */
  groups?: SelectOptionGroup[];
  /** Full width select */
  fullWidth?: boolean;
  /** Fit to parent cell height/width (table cell usage) */
  fitCell?: boolean;
  /** Extra class for trigger */
  triggerClassName?: string;
  /** Error state */
  error?: boolean;
}

export const StandardSelect = forwardRef<HTMLButtonElement, StandardSelectProps>(
  ({
    id,
    placeholder = 'Select...',
    options = [],
    groups = [],
    fullWidth,
    fitCell,
    triggerClassName,
    error,
    ...props
  }, ref) => {
    const hasGroups = groups.length > 0;
    const hasOptions = options.length > 0;

    return (
      <SelectPrimitive.Root {...props}>
        <SelectTrigger
          ref={ref}
          id={id}
          fullWidth={fullWidth}
          error={error}
          className={triggerClassName}
          data-fit-cell={fitCell ? 'true' : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {hasOptions && !hasGroups && options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}

          {hasGroups && groups.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              {group.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </SelectPrimitive.Root>
    );
  }
);

StandardSelect.displayName = 'StandardSelect';
