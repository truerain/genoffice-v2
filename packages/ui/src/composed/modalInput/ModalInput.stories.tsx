/**
 * @file packages/ui/src/composed/modalInput/ModalInput.stories.tsx
 * @description Storybook stories for ModalInput composed family (C8).
 * @created 2026-06-25
 *
 * @remark
 * - title: UI/Composed/ModalInput
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ModalInput } from './ModalInput';
import type { ModalInputListColumn, ModalInputSelection } from './ModalInput.types';

const sampleItems: ModalInputSelection[] = [
  { value: 'V001', label: 'Acme Corp', description: 'Seoul', keywords: ['acme'] },
  { value: 'V002', label: 'Beta Trading', description: 'Busan' },
  { value: 'V003', label: 'Gamma LLC', description: 'Tokyo', disabled: true },
  { value: 'V004', label: 'Delta Partners', description: 'Singapore' },
];

const tableColumns: ModalInputListColumn[] = [
  { key: 'value', header: 'Code', width: '6rem', render: (item) => item.value },
  { key: 'label', header: 'Name', render: (item) => item.label },
  { key: 'description', header: 'Region', render: (item) => item.description ?? '' },
];

const meta = {
  title: 'UI/Composed/ModalInput',
  component: ModalInput,
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
} satisfies Meta<typeof ModalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleDefault: Story = {
  render: () => {
    const [selected, setSelected] = useState<ModalInputSelection | null>(null);
    return (
      <ModalInput
        mode="single"
        items={sampleItems}
        selectedItem={selected}
        onSelectedItemChange={setSelected}
        onCommit={setSelected}
        modalHeight={250}
        modalWidth={400}
        label="Vendor"
        placeholder="Select vendor"
        title="Vendor lookup"
      />
    );
  },
};

export const SingleWithTableColumns: Story = {
  render: () => {
    const [selected, setSelected] = useState<ModalInputSelection | null>(null);
    return (
      <ModalInput
        mode="single"
        items={sampleItems}
        listColumns={tableColumns}
        selectedItem={selected}
        onCommit={setSelected}
        placeholder="Select vendor"
        title="Vendor lookup"
        modalWidth={640}
      />
    );
  },
};

export const MultiDefault: Story = {
  render: () => {
    const [selected, setSelected] = useState<ModalInputSelection[]>([]);
    return (
      <ModalInput
        mode="multi"
        items={sampleItems}
        selectedItems={selected}
        onSelectedItemsChange={setSelected}
        onCommit={setSelected}
        label="Vendors"
        placeholder="Select vendors"
        title="Vendor lookup"
        selectedTooltip="auto"
      />
    );
  },
};

export const MultiSelectedTooltip: Story = {
  render: () => {
    const [selected, setSelected] = useState<ModalInputSelection[]>([
      sampleItems[0],
      sampleItems[1],
      sampleItems[3],
    ]);
    return (
      <ModalInput
        mode="multi"
        items={sampleItems}
        selectedItems={selected}
        onCommit={setSelected}
        placeholder="Select vendors"
        title="Vendor lookup"
        selectedTooltip="auto"
      />
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<ModalInputSelection | null>(sampleItems[0] ?? null);
    return (
      <ModalInput
        mode="single"
        items={sampleItems}
        open={open}
        onOpenChange={setOpen}
        selectedItem={selected}
        onCommit={setSelected}
        placeholder="Select vendor"
        title="Vendor lookup"
      />
    );
  },
};

export const RemoteSearch: Story = {
  render: () => {
    const [selected, setSelected] = useState<ModalInputSelection | null>(null);
    return (
      <ModalInput
        mode="single"
        fetchItems={async (keyword) => {
          await new Promise((resolve) => window.setTimeout(resolve, 400));
          const query = keyword.trim().toLowerCase();
          if (!query) return sampleItems;
          return sampleItems.filter((item) =>
            [item.label, item.value, item.description ?? ''].join(' ').toLowerCase().includes(query)
          );
        }}
        selectedItem={selected}
        onCommit={setSelected}
        placeholder="Search vendor"
        title="Remote vendor lookup"
        searchPlaceholder="Type to search..."
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    mode: 'single',
    items: sampleItems,
    disabled: true,
    placeholder: 'Disabled',
    selectedItem: sampleItems[0],
  },
};
