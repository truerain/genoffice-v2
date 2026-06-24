/**
 * @file packages/ui/src/core/select/StandardSelect.stories.tsx
 * @description Storybook stories for StandardSelect (back-office default select).
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core3-overlays/StandardSelect
 */
import type { Meta, StoryObj } from '@storybook/react';
import { StandardSelect } from './StandardSelect';

const meta: Meta<typeof StandardSelect> = {
  title: 'UI/Core3-overlays/StandardSelect',
  component: StandardSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    placeholder: 'Choose an option...',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'option2',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const WithGroups: Story = {
  args: {
    placeholder: 'Choose a fruit or vegetable...',
    groups: [
      {
        label: 'Fruits',
        options: [
          { value: 'apple', label: '🍎 Apple' },
          { value: 'banana', label: '🍌 Banana' },
          { value: 'orange', label: '🍊 Orange' },
        ],
      },
      {
        label: 'Vegetables',
        options: [
          { value: 'carrot', label: '🥕 Carrot' },
          { value: 'potato', label: '🥔 Potato' },
          { value: 'tomato', label: '🍅 Tomato' },
        ],
      },
    ],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled select',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
  },
};

export const WithDisabledOptions: Story = {
  args: {
    placeholder: 'Some options are disabled',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2 (disabled)', disabled: true },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4 (disabled)', disabled: true },
    ],
  },
};

export const Error: Story = {
  args: {
    error: true,
    placeholder: 'This field has an error',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: 'Full width select',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export const ManyOptions: Story = {
  args: {
    placeholder: 'Choose a country...',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
      { value: 'it', label: 'Italy' },
      { value: 'es', label: 'Spain' },
      { value: 'jp', label: 'Japan' },
      { value: 'kr', label: 'South Korea' },
      { value: 'cn', label: 'China' },
      { value: 'in', label: 'India' },
    ],
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'This field is required',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
  },
};
