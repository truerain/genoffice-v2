/**
 * @file packages/ui/src/core/slider/Slider.stories.tsx
 * @description Storybook stories for Slider (apps/storybook auto-collects).
 * @created 2026-06-23
 *
 * @remark
 * - title: UI/Core/Slider
 * - Provide aria-label on Slider (no embedded label)
 */
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../label';
import { Slider } from './Slider';

const sliderWidth: CSSProperties = { width: '280px' };

const column: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const meta = {
  title: 'UI/Core2-form-toggles/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div style={sliderWidth}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    'aria-label': 'Volume',
  },
};

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    max: 100,
    step: 1,
    'aria-label': 'Price range',
  },
};

export const Steps: Story = {
  args: {
    defaultValue: [25],
    max: 100,
    step: 25,
    'aria-label': 'Quarter steps',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ ...column, width: '280px' }}>
      <div>
        <Label>Small</Label>
        <Slider defaultValue={[40]} size="sm" aria-label="Small slider" />
      </div>
      <div>
        <Label>Medium</Label>
        <Slider defaultValue={[50]} size="md" aria-label="Medium slider" />
      </div>
      <div>
        <Label>Large</Label>
        <Slider defaultValue={[60]} size="lg" aria-label="Large slider" />
      </div>
    </div>
  ),
  parameters: { layout: 'padded' },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    disabled: true,
    'aria-label': 'Disabled slider',
  },
};

export const Error: Story = {
  args: {
    defaultValue: [50],
    error: true,
    'aria-label': 'Error slider',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ ...column, width: '320px' }}>
      <div>
        <Label>Default</Label>
        <Slider defaultValue={[50]} aria-label="Default slider" />
      </div>
      <div>
        <Label>Range</Label>
        <Slider defaultValue={[25, 75]} aria-label="Range slider" />
      </div>
      <div>
        <Label>Disabled</Label>
        <Slider defaultValue={[30]} disabled aria-label="Disabled slider" />
      </div>
      <div>
        <Label error>Error</Label>
        <Slider defaultValue={[70]} error aria-label="Error slider" />
      </div>
    </div>
  ),
  parameters: { layout: 'padded' },
};
