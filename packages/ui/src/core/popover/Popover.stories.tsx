/**
 * @file packages/ui/src/core/popover/Popover.stories.tsx
 * @description Storybook stories for Popover compound primitives.
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core3-overlays/Popover
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Button } from '../button';

const meta: Meta<typeof Popover> = {
  title: 'UI/Core3-overlays/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = Pick<Story, 'render'>;

export const Default: RenderStory = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: '16rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-fg-secondary)' }}>
          Popover content anchored to the trigger.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithSideOffset: RenderStory = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Offset 12px</Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={12}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>Increased sideOffset.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const Controlled: RenderStory = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="outline">Default open</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>Opens by default for layout review.</p>
      </PopoverContent>
    </Popover>
  ),
};
