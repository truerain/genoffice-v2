/**
 * @file packages/ui/src/core/radio/SimpleRadioGroup.tsx
 * @description Options-array convenience wrapper over RadioGroup + Radio + Label.
 * @created 2026-06-23
 *
 * @remark
 * - Exports: SimpleRadioGroup, SimpleRadioGroupProps, RadioOption
 * - Uses core Label for each option; ids scoped with useId()
 */
import { forwardRef, useId } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Label } from '../label';
import { RadioGroup, Radio } from './Radio';
import type { RadioGroupProps } from './Radio.types';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SimpleRadioGroupProps extends Omit<RadioGroupProps, 'children'> {
  /** Radio options array */
  options: RadioOption[];
  /** Layout direction @default 'vertical' */
  orientation?: 'horizontal' | 'vertical';
  /** Error state applied to group and each Radio */
  error?: boolean;
}

export const SimpleRadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  SimpleRadioGroupProps
>(({ options = [], orientation = 'vertical', error, ...props }, ref) => {
  const groupId = useId();

  return (
    <RadioGroup
      ref={ref}
      error={error}
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: orientation === 'horizontal' ? '1rem' : '0.75rem',
      }}
      {...props}
    >
      {options.map((option) => {
        const inputId = `${groupId}-${option.value}`;

        return (
          <div
            key={option.value}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Radio
              value={option.value}
              id={inputId}
              disabled={option.disabled}
              error={error}
            />
            <Label
              htmlFor={inputId}
              error={error}
              style={{ cursor: option.disabled ? 'not-allowed' : 'pointer' }}
            >
              {option.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
});

SimpleRadioGroup.displayName = 'SimpleRadioGroup';
