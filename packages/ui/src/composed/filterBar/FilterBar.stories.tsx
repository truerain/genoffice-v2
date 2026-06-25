/**
 * @file packages/ui/src/composed/filterBar/FilterBar.stories.tsx
 * @description Storybook stories for FilterBar compound layout.
 * @created 2026-06-25
 *
 * @remark
 * - title: UI/Composed/FilterBar
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Search } from 'lucide-react';
import { FilterBar } from './FilterBar';
import { Button } from '../../core/button';
import { Input } from '../../core/input';
import { StandardSelect } from '../../core/select';

const meta: Meta<typeof FilterBar> = {
  title: 'UI/Composed/FilterBar',
  component: FilterBar,
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

const searchAction = (
  <Button variant="primary" size="md">
    <Search size={16} aria-hidden />
    Search
  </Button>
);

export const Compound: RenderStory = {
  render: () => (
    <FilterBar actions={searchAction}>
      <FilterBar.Item label="Keyword" size="fill">
        <Input placeholder="Search keyword" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Status" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Closed', value: 'CLOSED' },
          ]}
        />
      </FilterBar.Item>
      <FilterBar.Item label="Department" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'Sales', value: 'SALES' },
            { label: 'Finance', value: 'FINANCE' },
            { label: 'HR', value: 'HR' },
          ]}
        />
      </FilterBar.Item>
      <FilterBar.Item label="Organization" size="xs">
        <Input placeholder="HQ" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Account" size="sm">
        <Input placeholder="500100" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Category" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'General', value: 'GENERAL' },
            { label: 'Expense', value: 'EXPENSE' },
            { label: 'Asset', value: 'ASSET' },
          ]}
        />
      </FilterBar.Item>
    </FilterBar>
  ),
};

export const HorizontalItemLayout: RenderStory = {
  render: () => (
    <FilterBar itemLayout="horizontal" actions={searchAction}>
      <FilterBar.Item label="Keyword" size="fill">
        <Input placeholder="Search keyword" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Status" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Closed', value: 'CLOSED' },
          ]}
        />
      </FilterBar.Item>
      <FilterBar.Item label="Department" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'Sales', value: 'SALES' },
            { label: 'Finance', value: 'FINANCE' },
            { label: 'HR', value: 'HR' },
          ]}
        />
      </FilterBar.Item>
      <FilterBar.Item label="Organization" size="xs">
        <Input placeholder="HQ" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Account" size="sm">
        <Input placeholder="500100" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Category" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'General', value: 'GENERAL' },
            { label: 'Expense', value: 'EXPENSE' },
            { label: 'Asset', value: 'ASSET' },
          ]}
        />
      </FilterBar.Item>
    </FilterBar>
  ),
};

export const ColumnActions: RenderStory = {
  render: () => (
    <FilterBar
      actions={
        <>
          <Button variant="secondary" size="md">
            Reset
          </Button>
          <Button variant="primary" size="md">
            <Search size={16} aria-hidden />
            Search
          </Button>
        </>
      }
    >
      <FilterBar.Item label="Keyword" size="fill">
        <Input placeholder="Search keyword" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Status" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Pending', value: 'PENDING' },
          ]}
        />
      </FilterBar.Item>
      <FilterBar.Item label="Department" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'Sales', value: 'SALES' },
            { label: 'Finance', value: 'FINANCE' },
          ]}
        />
      </FilterBar.Item>
    </FilterBar>
  ),
};

export const Collapsible: RenderStory = {
  render: () => (
    <FilterBar collapsible collapsedCount={2} actions={searchAction}>
      <FilterBar.Item label="Keyword" size="fill" simple>
        <Input placeholder="Search keyword" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Status" size="sm" simple>
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Pending', value: 'PENDING' },
          ]}
        />
      </FilterBar.Item>
      <FilterBar.Item label="Department" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'Sales', value: 'SALES' },
            { label: 'Finance', value: 'FINANCE' },
          ]}
        />
      </FilterBar.Item>
      <FilterBar.Item label="Organization" size="xs">
        <Input placeholder="HQ" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Account" size="sm">
        <Input placeholder="500100" clearable fullWidth />
      </FilterBar.Item>
    </FilterBar>
  ),
};

export const InlineActions: RenderStory = {
  render: () => (
    <FilterBar actions={searchAction} actionsPlacement="inline">
      <FilterBar.Item label="Keyword" size="fill">
        <Input placeholder="Search keyword" clearable fullWidth />
      </FilterBar.Item>
      <FilterBar.Item label="Status" size="sm">
        <StandardSelect
          placeholder="All"
          fullWidth
          options={[
            { label: 'Active', value: 'ACTIVE' },
            { label: 'Pending', value: 'PENDING' },
          ]}
        />
      </FilterBar.Item>
    </FilterBar>
  ),
};
