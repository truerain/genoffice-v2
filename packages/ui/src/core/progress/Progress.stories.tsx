/**
 * @file packages/ui/src/core/progress/Progress.stories.tsx
 * @description Storybook stories for Progress bar.
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core5-feedback/Progress
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'UI/Core5-feedback/Progress',
  component: Progress,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = Pick<Story, 'render'>;

export const Default: RenderStory = {
  render: () => (
    <div style={{ width: 320 }}>
      <Progress value={45} />
    </div>
  ),
};

export const Variants: RenderStory = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Progress value={72} variant="default" />
      <Progress value={100} variant="success" />
      <Progress value={58} variant="warning" />
      <Progress value={24} variant="error" />
    </div>
  ),
};

export const Sizes: RenderStory = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Progress value={40} size="sm" />
      <Progress value={55} size="md" />
      <Progress value={70} size="lg" />
    </div>
  ),
};

export const Indeterminate: RenderStory = {
  render: () => (
    <div style={{ width: 320 }}>
      <Progress value={null} />
    </div>
  ),
};
