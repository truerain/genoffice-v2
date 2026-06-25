/**
 * @file packages/ui/src/core/maskedInput/MaskedInput.stories.tsx
 * @description Storybook stories for MaskedInput.
 * @created 2026-06-25
 *
 * @remark
 * - title: UI/Core/maskedInput/MaskedInput
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { MaskedInput } from './MaskedInput';

const meta = {
  title: 'UI/Core9-Etc/maskedInput/MaskedInput',
  component: MaskedInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' },
    error: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof MaskedInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YmdDefault: Story = {
  args: {
    label: 'Date',
    mask: 'ymd',
    placeholder: 'yyyy-mm-dd',
    autoSelect: false,
  },
};

export const YmdSeparatorSlash: Story = {
  args: {
    label: 'Date',
    mask: { preset: 'ymd', separator: '/' },
    placeholder: 'yyyy/mm/dd',
    autoSelect: false,
  },
};

export const YearMonth: Story = {
  args: {
    label: 'Month',
    mask: 'ym',
    placeholder: 'yyyy-mm',
    autoSelect: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Date',
    mask: 'ymd',
    defaultValue: '2026-06-25',
    disabled: true,
    autoSelect: false,
  },
};

export const Clearable: Story = {
  args: {
    label: 'Date',
    mask: 'ymd',
    defaultValue: '2026-06-25',
    placeholder: 'yyyy-mm-dd',
    clearable: true,
    autoSelect: false,
  },
};

export const WithSuffix: Story = {
  render: () => (
    <MaskedInput
      label="Date"
      mask="ymd"
      placeholder="yyyy-mm-dd"
      autoSelect={false}
      clearable
      suffix={
        <button
          type="button"
          aria-label="Open calendar"
          style={{ display: 'inline-flex', padding: 0, border: 0, background: 'transparent' }}
        >
          <Calendar size={16} aria-hidden />
        </button>
      }
    />
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('2026-06-');

    return (
      <div style={{ width: 240 }}>
        <MaskedInput
          label="Controlled"
          mask="ymd"
          value={value}
          onChange={(next) => setValue(next)}
          autoSelect={false}
          clearable
          helperText={`value: ${value}`}
        />
      </div>
    );
  },
};
