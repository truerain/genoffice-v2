/**
 * @file packages/ui/src/core/checkbox/Checkbox.stories.tsx
 * @description Storybook stories for Checkbox (apps/storybook auto-collects).
 * @created 2026-06-23
 *
 * @remark
 * - title: UI/Core/Checkbox
 * - Label pairing uses core Label; Checkbox does not embed a label
 */
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../label';
import { Checkbox } from './Checkbox';

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
  title: 'UI/Core2-form-toggles/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
    defaultChecked: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Checkbox',
  },
};

export const Checked: Story = {
  args: {
    'aria-label': 'Checked checkbox',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    'aria-label': 'Disabled checkbox',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    'aria-label': 'Disabled checked checkbox',
    disabled: true,
    defaultChecked: true,
  },
};

export const Error: Story = {
  args: {
    'aria-label': 'Error checkbox',
    error: true,
  },
};

export const ErrorChecked: Story = {
  args: {
    'aria-label': 'Error checked checkbox',
    error: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div style={row}>
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions, 약관 동의</Label>
    </div>
  ),
};

export const WithRequiredLabel: Story = {
  render: () => (
    <div style={row}>
      <Checkbox id="terms-required" required />
      <Label htmlFor="terms-required" required>
        I accept the terms (required)
      </Label>
    </div>
  ),
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div style={column}>
      <div style={row}>
        <Checkbox id="option1" defaultChecked />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div style={row}>
        <Checkbox id="option2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div style={row}>
        <Checkbox id="option3" />
        <Label htmlFor="option3">Option 3, 한글 옵션</Label>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={column}>
      <div style={row}>
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div style={row}>
        <Checkbox id="checked" defaultChecked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div style={row}>
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled" style={{ opacity: 0.5 }}>
          Disabled
        </Label>
      </div>
      <div style={row}>
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked" style={{ opacity: 0.5 }}>
          Disabled Checked
        </Label>
      </div>
      <div style={row}>
        <Checkbox id="error" error />
        <Label htmlFor="error" error>
          Error State
        </Label>
      </div>
      <div style={row}>
        <Checkbox id="error-checked" error defaultChecked />
        <Label htmlFor="error-checked" error>
          Error Checked
        </Label>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const FormExample: Story = {
  render: () => (
    <form style={{ ...column, width: '24rem' }}>
      <div style={row}>
        <Checkbox id="form-newsletter" defaultChecked />
        <Label htmlFor="form-newsletter">Subscribe to newsletter</Label>
      </div>
      <div style={row}>
        <Checkbox id="form-marketing" required />
        <Label htmlFor="form-marketing" required>
          Receive marketing emails
        </Label>
      </div>
      <div style={row}>
        <Checkbox id="form-privacy" error />
        <Label htmlFor="form-privacy" error>
          Accept privacy policy (required)
        </Label>
      </div>
    </form>
  ),
  parameters: {
    layout: 'padded',
  },
};
