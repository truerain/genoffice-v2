/**
 * @file packages/ui/src/core/switch/Switch.stories.tsx
 * @description Storybook stories for Switch (apps/storybook auto-collects).
 * @created 2026-06-23
 *
 * @remark
 * - title: UI/Core/Switch
 * - Label pairing uses core Label; Switch does not embed a label
 */
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '../label';
import { Switch } from './Switch';

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
  title: 'UI/Core/Switch',
  component: Switch,
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Switch',
  },
};

export const Checked: Story = {
  args: {
    'aria-label': 'Checked switch',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    'aria-label': 'Disabled switch',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    'aria-label': 'Disabled checked switch',
    disabled: true,
    defaultChecked: true,
  },
};

export const Error: Story = {
  args: {
    'aria-label': 'Error switch',
    error: true,
  },
};

export const ErrorChecked: Story = {
  args: {
    'aria-label': 'Error checked switch',
    error: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div style={row}>
      <Switch id="airplane" />
      <Label htmlFor="airplane">Airplane Mode, 비행기 모드</Label>
    </div>
  ),
};

export const WithRequiredLabel: Story = {
  render: () => (
    <div style={row}>
      <Switch id="notifications" required />
      <Label htmlFor="notifications" required>
        Enable notifications (required)
      </Label>
    </div>
  ),
};

export const Examples: Story = {
  render: () => (
    <div style={column}>
      <div style={row}>
        <Switch id="s1" defaultChecked />
        <Label htmlFor="s1">Enable Notifications</Label>
      </div>
      <div style={row}>
        <Switch id="s2" />
        <Label htmlFor="s2">Dark Mode</Label>
      </div>
      <div style={row}>
        <Switch id="s3" defaultChecked />
        <Label htmlFor="s3">Auto-save, 자동 저장</Label>
      </div>
      <div style={row}>
        <Switch id="s4" disabled />
        <Label htmlFor="s4" style={{ opacity: 0.5 }}>
          Disabled Option
        </Label>
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
        <Switch id="off" />
        <Label htmlFor="off">Off</Label>
      </div>
      <div style={row}>
        <Switch id="on" defaultChecked />
        <Label htmlFor="on">On</Label>
      </div>
      <div style={row}>
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off" style={{ opacity: 0.5 }}>
          Disabled Off
        </Label>
      </div>
      <div style={row}>
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on" style={{ opacity: 0.5 }}>
          Disabled On
        </Label>
      </div>
      <div style={row}>
        <Switch id="error-off" error />
        <Label htmlFor="error-off" error>
          Error Off
        </Label>
      </div>
      <div style={row}>
        <Switch id="error-on" error defaultChecked />
        <Label htmlFor="error-on" error>
          Error On
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
        <Switch id="form-notifications" defaultChecked />
        <Label htmlFor="form-notifications">Push notifications</Label>
      </div>
      <div style={row}>
        <Switch id="form-marketing" required />
        <Label htmlFor="form-marketing" required>
          Marketing emails
        </Label>
      </div>
      <div style={row}>
        <Switch id="form-privacy" error defaultChecked />
        <Label htmlFor="form-privacy" error>
          Share usage data (review required)
        </Label>
      </div>
    </form>
  ),
  parameters: {
    layout: 'padded',
  },
};
