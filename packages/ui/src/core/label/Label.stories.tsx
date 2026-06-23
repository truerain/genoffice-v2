/**
 * @file packages/ui/src/core/label/Label.stories.tsx
 * @description Storybook stories for Label (apps/storybook auto-collects).
 * @created 2026-06-23
 *
 * @remark
 * - title: UI/Core/Label (integrated storybook taxonomy)
 * - WithInput/Checkbox stories use native controls until Input/Checkbox core Gate
 */
import type { CSSProperties, InputHTMLAttributes } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const fieldStack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '300px',
};

const storyInputStyle: CSSProperties = {
  padding: '0.5rem 0.75rem',
  border: '1px solid var(--color-border-default)',
  borderRadius: '0.25rem',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-family-primary)',
  color: 'var(--color-fg-primary)',
  background: 'var(--color-bg-primary)',
};

function StoryInput({
  error,
  style,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      style={{
        ...storyInputStyle,
        ...(error ? { borderColor: 'var(--color-status-error)' } : {}),
        ...style,
      }}
    />
  );
}

const meta = {
  title: 'UI/Core/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    required: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label Text, 한글 텍스트',
  },
};

export const Required: Story = {
  args: {
    children: 'Required Field',
    required: true,
  },
};

export const Error: Story = {
  args: {
    children: 'Error Label, 한글에러',
    error: true,
  },
};

export const WithInput: Story = {
  render: () => (
    <div style={fieldStack}>
      <Label htmlFor="username">Username, 한글아이디</Label>
      <StoryInput id="username" placeholder="Enter username" />
    </div>
  ),
};

export const WithRequiredInput: Story = {
  render: () => (
    <div style={fieldStack}>
      <Label htmlFor="email" required>
        Email Address
      </Label>
      <StoryInput id="email" type="email" placeholder="your@email.com" />
    </div>
  ),
};

export const WithErrorInput: Story = {
  render: () => (
    <div style={fieldStack}>
      <Label htmlFor="password" error>
        Password, 한글비밀번호 입력
      </Label>
      <StoryInput id="password" type="password" error defaultValue="short" />
      <span style={{ fontSize: '0.8125rem', color: 'var(--color-status-error)' }}>
        Password must be at least 8 characters(비밀번호 최소 8자 이상 입력)
      </span>
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <input id="terms" type="checkbox" />
      <Label htmlFor="terms">I accept the terms and conditions</Label>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <div style={fieldStack}>
        <Label htmlFor="name" required>
          Full Name
        </Label>
        <StoryInput id="name" placeholder="John Doe" />
      </div>

      <div style={fieldStack}>
        <Label htmlFor="form-email" required>
          Email
        </Label>
        <StoryInput id="form-email" type="email" placeholder="john@example.com" />
      </div>

      <div style={fieldStack}>
        <Label htmlFor="form-password" required>
          Password
        </Label>
        <StoryInput id="form-password" type="password" placeholder="••••••••" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input id="form-newsletter" type="checkbox" />
        <Label htmlFor="form-newsletter">Subscribe to newsletter</Label>
      </div>
    </form>
  ),
  parameters: {
    layout: 'padded',
  },
};
