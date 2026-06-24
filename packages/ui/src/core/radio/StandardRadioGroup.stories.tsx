/**
 * @file packages/ui/src/core/radio/StandardRadioGroup.stories.tsx
 * @description Storybook stories for StandardRadioGroup (back-office default radio group).
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core/StandardRadioGroup
 * - Custom layouts: UI/Core/Radio (RadioGroup + Radio)
 */
import type { Meta, StoryObj } from '@storybook/react';
import { StandardRadioGroup } from './StandardRadioGroup';

const meta = {
  title: 'UI/Core/StandardRadioGroup',
  component: StandardRadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof StandardRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
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

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'maybe', label: 'Maybe' },
    ],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'option1',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
  },
};

export const WithDisabledOptions: Story = {
  args: {
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
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
  },
};

export const ManyOptions: Story = {
  args: {
    options: [
      { value: '1', label: 'Strongly Disagree' },
      { value: '2', label: 'Disagree' },
      { value: '3', label: 'Neutral' },
      { value: '4', label: 'Agree' },
      { value: '5', label: 'Strongly Agree' },
    ],
  },
};

export const WithEmojis: Story = {
  args: {
    orientation: 'horizontal',
    options: [
      { value: 'bad', label: '😞 Bad' },
      { value: 'okay', label: '😐 Okay' },
      { value: 'good', label: '😊 Good' },
      { value: 'great', label: '😄 Great' },
    ],
  },
};

export const Required: Story = {
  args: {
    required: true,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
  },
};
