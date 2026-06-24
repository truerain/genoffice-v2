/**
 * @file packages/ui/src/core/tooltip/Tooltip.stories.tsx
 * @description Storybook stories for Tooltip compound primitives.
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core5-feedback/Tooltip
 */
import type { Meta, StoryObj } from '@storybook/react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from './Tooltip';
import { Button } from '../button';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Core5-feedback/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={200}>
        <Story />
      </TooltipProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = Pick<Story, 'render'>;

export const Default: RenderStory = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        Additional context for this control.
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  ),
};

export const Sides: RenderStory = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            Tooltip on {side}
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
