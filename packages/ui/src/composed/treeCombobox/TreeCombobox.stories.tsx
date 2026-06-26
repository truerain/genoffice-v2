/**
 * @file packages/ui/src/composed/treeCombobox/TreeCombobox.stories.tsx
 * @description Storybook stories for TreeCombobox (C7).
 * @created 2026-06-25
 *
 * @remark
 * - title: UI/Composed/TreeCombobox
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TreeCombobox } from './TreeCombobox';
import type { TreeComboboxOption } from './TreeCombobox.types';

const orgTree: TreeComboboxOption[] = [
  { id: 'hq', parentId: null, value: 'HQ', label: 'Headquarters' },
  { id: 'sales', parentId: 'hq', value: 'SALES', label: 'Sales Division' },
  { id: 'finance', parentId: 'hq', value: 'FINANCE', label: 'Finance Division' },
  { id: 'east', parentId: 'sales', value: 'EAST', label: 'East Region' },
  { id: 'west', parentId: 'sales', value: 'WEST', label: 'West Region' },
  { id: 'seoul', parentId: 'east', value: 'SEOUL', label: 'Seoul Office' },
  { id: 'busan', parentId: 'east', value: 'BUSAN', label: 'Busan Office' },
];

const meta = {
  title: 'UI/Composed/TreeCombobox',
  component: TreeCombobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <TreeCombobox
        options={orgTree}
        value={value}
        onValueChange={(next) => setValue(next)}
        placeholder="Select organization"
      />
    );
  },
};

export const Expanded: Story = {
  render: () => (
    <TreeCombobox
      options={orgTree}
      defaultExpandedIds={['hq', 'sales']}
      placeholder="Select organization"
      onValueChange={() => {}}
    />
  ),
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = useState('SEOUL');
    return (
      <TreeCombobox
        options={orgTree}
        value={value}
        onValueChange={(next) => setValue(next)}
        defaultExpandedIds={['hq', 'sales', 'east']}
        clearable
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    options: orgTree,
    value: 'HQ',
    disabled: true,
    onValueChange: () => {},
  },
};

export const WithFilter: Story = {
  render: () => (
    <TreeCombobox
      options={orgTree}
      placeholder="Type to filter tree"
      onValueChange={() => {}}
    />
  ),
};
