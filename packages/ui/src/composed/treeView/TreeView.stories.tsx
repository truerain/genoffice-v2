/**
 * @file packages/ui/src/composed/treeView/TreeView.stories.tsx
 * @description Storybook stories for TreeView composed family (C9).
 * @created 2026-06-25
 *
 * @remark
 * - title: UI/Composed/TreeView
 * - Parent frame needs explicit height for panel fill
 */
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TreeView } from './TreeView';
import type { TreeViewId } from './TreeView.types';
import { SplitLayout } from '../splitLayout/SplitLayout';

type DemoNode = {
  id: TreeViewId;
  parent_id: TreeViewId | null;
  label: string;
};

const orgData: DemoNode[] = [
  { id: 'org', parent_id: null, label: 'Organization' },
  { id: 'eng', parent_id: 'org', label: 'Engineering' },
  { id: 'fe', parent_id: 'eng', label: 'Frontend' },
  { id: 'be', parent_id: 'eng', label: 'Backend' },
  { id: 'sales', parent_id: 'org', label: 'Sales' },
  { id: 'ops', parent_id: null, label: 'Operations' },
];

const panelFrameStyle: CSSProperties = {
  width: 320,
  height: 420,
  minHeight: 0,
};

const meta = {
  title: 'UI/Composed/TreeView',
  component: TreeView,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={panelFrameStyle}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: orgData,
    title: 'Organization',
    defaultExpandedIds: ['org', 'eng'],
  },
};

export const ControlledSelection: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<TreeViewId>('fe');
    return (
      <TreeView
        data={orgData}
        title="Organization"
        defaultExpandedIds={['org', 'eng']}
        selectedId={selectedId}
        onSelect={(item) => setSelectedId(item.id)}
      />
    );
  },
};

export const WithoutControls: Story = {
  args: {
    data: orgData,
    title: 'Organization',
    showControls: false,
    defaultExpandedIds: ['org'],
  },
};

export const WithSplitLayout: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<TreeViewId | undefined>('fe');
    return (
      <div style={{ width: '100%', maxWidth: 720, height: 400 }}>
        <SplitLayout
          leftWidth="38%"
          resizable
          left={
            <TreeView
              data={orgData}
              title="Menu"
              defaultExpandedIds={['org', 'eng']}
              selectedId={selectedId}
              onSelect={(item) => setSelectedId(item.id)}
            />
          }
          right={
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-fg-secondary)',
                fontSize: '0.875rem',
              }}
            >
              Selected: {selectedId ?? '—'}
            </div>
          }
        />
      </div>
    );
  },
  decorators: [(Story) => <Story />],
};
