/**
 * @file packages/ui/src/core/calendar/Calendar.stories.tsx
 * @description Storybook stories for Calendar (DayPicker v10 wrapper).
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core4-navigation/Calendar
 * - Composed DatePicker는 이 컴포넌트를 Popover+Input과 조합 (Wave 5)
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Core4-navigation/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = Pick<Story, 'render'>;

export const Default: RenderStory = {
  render: () => <Calendar />,
};

export const SingleSelect: RenderStory = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>(new Date());

    return (
      <Calendar
        mode="single"
        selected={selected}
        onSelect={setSelected}
      />
    );
  },
};

export const RangeSelect: RenderStory = {
  render: () => {
    const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>();

    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
      />
    );
  },
};

export const WithoutOutsideDays: RenderStory = {
  render: () => <Calendar showOutsideDays={false} />,
};
