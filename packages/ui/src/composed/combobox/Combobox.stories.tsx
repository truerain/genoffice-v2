/**
 * @file packages/ui/src/composed/combobox/Combobox.stories.tsx
 * @description Storybook stories for Combobox composed family (C6).
 * @created 2026-06-25
 *
 * @remark
 * - title: UI/Composed/Combobox
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox } from './Combobox';
import { MultiCombobox } from './MultiCombobox';
import type { ComboboxOption } from './Combobox.types';

const sampleOptions: ComboboxOption[] = [
  { label: 'Seoul HQ', value: 'SEOUL', group: 'Korea' },
  { label: 'Busan Branch', value: 'BUSAN', group: 'Korea' },
  { label: 'Tokyo Office', value: 'TOKYO', group: 'Japan' },
  { label: 'Osaka Office', value: 'OSAKA', group: 'Japan', disabled: true },
  { label: 'Singapore Hub', value: 'SG', description: 'APAC regional' },
];

const meta = {
  title: 'UI/Composed/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Combobox
        options={sampleOptions}
        value={value}
        onValueChange={(next) => setValue(next)}
        placeholder="Select office"
      />
    );
  },
};

export const Grouped: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Search office',
    onValueChange: () => {},
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState('SEOUL');
    return (
      <Combobox
        options={sampleOptions}
        value={value}
        onValueChange={(next) => setValue(next)}
        clearable
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    options: sampleOptions,
    value: 'SEOUL',
    disabled: true,
    onValueChange: () => {},
  },
};

export const MultiDefault: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['SEOUL']);
    return (
      <MultiCombobox
        options={sampleOptions}
        values={values}
        onValuesChange={(next) => setValues(next)}
        placeholder="Select offices"
        clearable
      />
    );
  },
};

export const MultiClearable: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['SEOUL', 'BUSAN', 'TOKYO']);
    return (
      <MultiCombobox
        options={sampleOptions}
        values={values}
        onValuesChange={(next) => setValues(next)}
        clearable
        selectedTooltip="auto"
      />
    );
  },
};

export const MultiSelectedTooltip: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['SEOUL', 'BUSAN', 'TOKYO', 'SG']);
    return (
      <MultiCombobox
        options={sampleOptions}
        values={values}
        onValuesChange={(next) => setValues(next)}
        placeholder="Hover to see all selected"
        selectedTooltip="auto"
        clearable
      />
    );
  },
};

export const MultiDisabled: Story = {
  args: {
    options: sampleOptions,
    values: ['SEOUL', 'BUSAN'],
    disabled: true,
    onValuesChange: () => {},
  },
};
