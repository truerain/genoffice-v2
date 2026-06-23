/**
 * @file packages/ui/src/core/separator/Separator.stories.tsx
 * @description Storybook stories for Separator (apps/storybook auto-collects).
 * @created 2026-06-23
 *
 * @remark
 * - title: UI/Core/Separator (integrated storybook taxonomy)
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';

const meta = {
  title: 'UI/Core/Separator',
  component: Separator,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'radio',
      options: ['subtle', 'default', 'strong'],
    },
    decorative: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'default',
  },
  render: (args) => (
    <div style={{ width: '100%' }}>
      <div style={{ padding: '8px 0' }}>Section A</div>
      <Separator {...args} />
      <div style={{ padding: '8px 0' }}>Section B</div>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    variant: 'default',
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
      <span style={{ padding: '0 12px' }}>Left</span>
      <Separator {...args} />
      <span style={{ padding: '0 12px' }}>Right</span>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-secondary)', marginBottom: '0.5rem' }}>
          subtle
        </div>
        <Separator variant="subtle" />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-secondary)', marginBottom: '0.5rem' }}>
          default
        </div>
        <Separator variant="default" />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-fg-secondary)', marginBottom: '0.5rem' }}>
          strong
        </div>
        <Separator variant="strong" />
      </div>
    </div>
  ),
};
