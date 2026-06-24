/**
 * @file packages/ui/src/core/radio/Radio.stories.tsx
 * @description Storybook stories for RadioGroup + Radio primitives.
 * @created 2026-06-23
 *
 * @remark
 * - title: UI/Core/Radio
 * - Label pairing uses core Label
 */
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../label';
import { RadioGroup, Radio } from './Radio';

const row: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const column: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const meta = {
  title: 'UI/Core2-form-toggles/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div style={row}>
        <Radio value="option1" id="r1" />
        <Label htmlFor="r1">Option 1</Label>
      </div>
      <div style={row}>
        <Radio value="option2" id="r2" />
        <Label htmlFor="r2">Option 2</Label>
      </div>
      <div style={row}>
        <Radio value="option3" id="r3" />
        <Label htmlFor="r3">Option 3, 한글 옵션</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div style={row}>
        <Radio value="option1" id="d1" disabled />
        <Label htmlFor="d1" style={{ opacity: 0.5 }}>
          Disabled Unchecked
        </Label>
      </div>
      <div style={row}>
        <Radio value="option2" id="d2" disabled />
        <Label htmlFor="d2" style={{ opacity: 0.5 }}>
          Disabled Checked
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const Error: Story = {
  render: () => (
    <RadioGroup>
      <div style={row}>
        <Radio value="option1" id="e1" error />
        <Label htmlFor="e1" error>
          Error Option 1
        </Label>
      </div>
      <div style={row}>
        <Radio value="option2" id="e2" error />
        <Label htmlFor="e2" error>
          Error Option 2
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="small" style={{ flexDirection: 'row', gap: '1.5rem' }}>
      <div style={row}>
        <Radio value="small" id="h1" />
        <Label htmlFor="h1">Small</Label>
      </div>
      <div style={row}>
        <Radio value="medium" id="h2" />
        <Label htmlFor="h2">Medium</Label>
      </div>
      <div style={row}>
        <Radio value="large" id="h3" />
        <Label htmlFor="h3">Large</Label>
      </div>
    </RadioGroup>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={column}>
      <RadioGroup defaultValue="checked">
        <div style={row}>
          <Radio value="unchecked" id="as-unchecked" />
          <Label htmlFor="as-unchecked">Unchecked</Label>
        </div>
        <div style={row}>
          <Radio value="checked" id="as-checked" />
          <Label htmlFor="as-checked">Checked</Label>
        </div>
      </RadioGroup>
      <RadioGroup>
        <div style={row}>
          <Radio value="err" id="as-error" error />
          <Label htmlFor="as-error" error>
            Error
          </Label>
        </div>
      </RadioGroup>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
