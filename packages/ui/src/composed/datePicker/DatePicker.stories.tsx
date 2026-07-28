/**
 * @file packages/ui/src/composed/datePicker/DatePicker.stories.tsx
 * @description Storybook stories for date picker composed family.
 * @created 2026-06-25
 * @updated 2026-07-29
 *
 * @remark
 * - title: UI/Composed/DatePicker
 * - Includes MultiDatePicker / MultiMonthPicker
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';
import { MonthPicker } from './MonthPicker';
import { MultiDatePicker } from './MultiDatePicker';
import { MultiMonthPicker } from './MultiMonthPicker';
import { RangeDatePicker } from './RangeDatePicker';
import { RangeMonthPicker } from './RangeMonthPicker';
import type { DateRange } from './RangeDatePicker.types';
import type { MonthRange } from './RangeMonthPicker.types';

const meta = {
  title: 'UI/Composed/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();
    return (
      <DatePicker
        value={value}
        onChange={setValue}
        clearable
      />
    );
  },
};

export const WithLocale: Story = {
  args: {
    locale: 'ko-KR',
    value: new Date(2026, 5, 25),
    onChange: () => {},
  },
};

export const Clearable: Story = {
  args: {
    clearable: true,
    value: new Date(2026, 5, 25),
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: new Date(2026, 5, 25),
    onChange: () => {},
  },
};

export const MonthDefault: Story = {
  render: () => {
    const [value, setValue] = useState<Date | undefined>();
    return <MonthPicker value={value} onChange={setValue} clearable />;
  },
};

export const MonthFromTo: Story = {
  render: () => (
    <MonthPicker
      fromMonth={new Date(2025, 0, 1)}
      toMonth={new Date(2027, 11, 1)}
      value={new Date(2026, 5, 1)}
      onChange={() => {}}
    />
  ),
};

export const MonthEditorOverlay: Story = {
  render: () => (
    <MonthPicker editorOverlay value={new Date(2026, 5, 1)} onChange={() => {}} />
  ),
};

export const RangeDefault: Story = {
  render: () => {
    const [value, setValue] = useState<DateRange | undefined>();
    return <RangeDatePicker value={value} onChange={setValue} />;
  },
};

export const RangeConfirmClear: Story = {
  render: () => (
    <RangeDatePicker
      clearable
      value={{ from: new Date(2026, 5, 1), to: new Date(2026, 5, 15) }}
      onChange={() => {}}
    />
  ),
};

export const RangeMonthDefault: Story = {
  render: () => {
    const [value, setValue] = useState<MonthRange | undefined>();
    return <RangeMonthPicker value={value} onChange={setValue} />;
  },
};

export const MultiDateDefault: Story = {
  render: () => {
    const [value, setValue] = useState<Date[] | undefined>();
    return <MultiDatePicker value={value} onChange={setValue} />;
  },
};

export const MultiDateConfirmClear: Story = {
  render: () => (
    <MultiDatePicker
      clearable
      value={[new Date(2026, 5, 1), new Date(2026, 5, 15), new Date(2026, 6, 1)]}
      onChange={() => {}}
    />
  ),
};

export const MultiMonthDefault: Story = {
  render: () => {
    const [value, setValue] = useState<Date[] | undefined>();
    return <MultiMonthPicker value={value} onChange={setValue} />;
  },
};

export const MultiMonthTwoYears: Story = {
  render: () => {
    const [value, setValue] = useState<Date[] | undefined>([
      new Date(2026, 0, 1),
      new Date(2026, 5, 1),
      new Date(2027, 2, 1),
    ]);
    return (
      <MultiMonthPicker
        value={value}
        onChange={setValue}
        visibleYears={2}
        fromMonth={new Date(2025, 0, 1)}
        toMonth={new Date(2027, 11, 1)}
      />
    );
  },
};
