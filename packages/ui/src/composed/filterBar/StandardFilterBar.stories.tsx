/**
 * @file packages/ui/src/composed/filterBar/StandardFilterBar.stories.tsx
 * @description Storybook stories for StandardFilterBar.
 * @created 2026-06-25
 *
 * @remark
 * - title: UI/Composed/StandardFilterBar
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { StandardFilterBar } from './StandardFilterBar';
import type { FilterField } from './FilterBar.types';
import type { DateRange } from '../datePicker/RangeDatePicker.types';
import type { MonthRange } from '../datePicker/RangeMonthPicker.types';

type DemoFilters = {
  keyword: string;
  status: string;
  department: string;
  orgCode: string;
  accountCode: string;
  category: string;
};

const initialDemoFilters: DemoFilters = {
  keyword: '',
  status: '',
  department: '',
  orgCode: '',
  accountCode: '',
  category: '',
};

const demoFields: FilterField<DemoFilters>[] = [
  {
    key: 'keyword',
    label: 'Keyword',
    type: 'search',
    placeholder: 'Search keyword',
    size: 'fill',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'All',
    size: 'sm',
    options: [
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Pending', value: 'PENDING' },
      { label: 'Closed', value: 'CLOSED' },
    ],
  },
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    placeholder: 'All',
    size: 'sm',
    options: [
      { label: 'Sales', value: 'SALES' },
      { label: 'Finance', value: 'FINANCE' },
      { label: 'HR', value: 'HR' },
    ],
  },
  {
    key: 'orgCode',
    label: 'Organization',
    type: 'text',
    placeholder: 'HQ',
    size: 'xs',
  },
  {
    key: 'accountCode',
    label: 'Account',
    type: 'text',
    placeholder: '500100',
    size: 'sm',
  },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    placeholder: 'All',
    size: 'sm',
    options: [
      { label: 'General', value: 'GENERAL' },
      { label: 'Expense', value: 'EXPENSE' },
      { label: 'Asset', value: 'ASSET' },
    ],
  },
];

const meta: Meta<typeof StandardFilterBar> = {
  title: 'UI/Composed/StandardFilterBar',
  component: StandardFilterBar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 960 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = Pick<Story, 'render'>;

export const Default: RenderStory = {
  render: () => {
    const [value, setValue] = useState<DemoFilters>(initialDemoFilters);
    const fields = useMemo(() => demoFields, []);

    return (
      <StandardFilterBar
        value={value}
        fields={fields}
        onChange={setValue}
        onSearch={() => console.log('search', value)}
        searchLabel="검색"
      />
    );
  },
};

export const HorizontalItemLayout: RenderStory = {
  render: () => {
    const [value, setValue] = useState<DemoFilters>(initialDemoFilters);
    const fields = useMemo(() => demoFields, []);

    return (
      <StandardFilterBar
        itemLayout="horizontal"
        value={value}
        fields={fields}
        onChange={setValue}
        onSearch={() => console.log('search', value)}
        searchLabel="검색"
      />
    );
  },
};

export const TextWithEnterSearch: RenderStory = {
  render: () => {
    const [value, setValue] = useState({ code: '' });

    return (
      <StandardFilterBar
        value={value}
        fields={[
          {
            key: 'code',
            label: 'Code',
            type: 'text',
            placeholder: 'Enter code',
            enterToSearch: true,
            size: 'md',
          },
        ]}
        onChange={setValue}
        onSearch={() => console.log('search', value)}
      />
    );
  },
};

export const Collapsible: RenderStory = {
  render: () => {
    const [value, setValue] = useState<DemoFilters>(initialDemoFilters);
    const fields = useMemo(() => demoFields, []);

    return (
      <StandardFilterBar
        collapsible
        collapsedCount={3}
        value={value}
        fields={fields}
        onChange={setValue}
        onSearch={() => console.log('search', value)}
        searchLabel="검색"
      />
    );
  },
};

type DateFilterValues = {
  keyword: string;
  fromDate?: Date;
  baseMonth?: Date;
  period?: DateRange;
  monthPeriod?: MonthRange;
};

export const WithDateAndMonth: RenderStory = {
  render: () => {
    const [value, setValue] = useState<DateFilterValues>({
      keyword: '',
      fromDate: new Date(2026, 5, 1),
      baseMonth: new Date(2026, 5, 1),
      period: {
        from: new Date(2026, 5, 1),
        to: new Date(2026, 5, 15),
      },
      monthPeriod: {
        from: new Date(2026, 2, 1),
        to: new Date(2026, 7, 1),
      },
    });

    const fields = useMemo<FilterField<DateFilterValues>[]>(
      () => [
        {
          key: 'keyword',
          label: 'Keyword',
          type: 'search',
          placeholder: 'Search',
          size: 'fill',
          simple: true,
        },
        {
          key: 'fromDate',
          label: 'From date',
          type: 'date',
          placeholder: 'yyyy-mm-dd',
          size: 'sm',
          clearable: true,
          simple: true,
        },
        {
          key: 'baseMonth',
          label: 'Base month',
          type: 'month',
          placeholder: 'yyyy-mm',
          size: 'sm',
          clearable: true,
        },
        {
          key: 'period',
          label: 'Date range',
          type: 'date-range',
          placeholder: 'Select date range',
          size: 'md',
          clearable: true,
        },
        {
          key: 'monthPeriod',
          label: 'Month range',
          type: 'month-range',
          placeholder: 'Select month range',
          size: 'md',
          clearable: true,
        },
      ],
      []
    );

    return (
      <StandardFilterBar
        collapsible
        collapsedCount={2}
        value={value}
        fields={fields}
        onChange={setValue}
        onSearch={() => console.log('search', value)}
        searchLabel="검색"
      />
    );
  },
};
