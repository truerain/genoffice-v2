/**
 * @file packages/ui/src/core/tree/Tree.stories.tsx
 * @description Storybook stories for Tree hierarchical list.
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core4-navigation/Tree
 * - Wave 5 TreeView / TreeCombobox는 이 primitive를 조합
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tree } from './Tree';
import type { TreeId } from './Tree.types';

type DemoNode = {
  id: TreeId;
  parent_id: TreeId | null;
  label: string;
};

const sampleData: DemoNode[] = [
  { id: 'org', parent_id: null, label: 'Organization' },
  { id: 'eng', parent_id: 'org', label: 'Engineering' },
  { id: 'fe', parent_id: 'eng', label: 'Frontend' },
  { id: 'be', parent_id: 'eng', label: 'Backend' },
  { id: 'sales', parent_id: 'org', label: 'Sales' },
  { id: 'ops', parent_id: null, label: 'Operations' },
];

const meta: Meta<typeof Tree> = {
  title: 'UI/Core4-navigation/Tree',
  component: Tree,
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
    <div style={{ width: 280 }}>
      <Tree data={sampleData} defaultExpandedIds={['org', 'eng']} />
    </div>
  ),
};

export const ControlledSelection: RenderStory = {
  render: () => {
    const [selectedId, setSelectedId] = useState<TreeId>('fe');

    return (
      <div style={{ width: 280 }}>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: 'var(--color-fg-secondary)' }}>
          Selected: {String(selectedId)}
        </p>
        <Tree
          data={sampleData}
          defaultExpandedIds={['org', 'eng']}
          selectedId={selectedId}
          onSelect={(item) => setSelectedId(item.id)}
        />
      </div>
    );
  },
};

export const ControlledExpand: RenderStory = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<TreeId[]>(['org']);

    return (
      <div style={{ width: 280 }}>
        <Tree
          data={sampleData}
          expandedIds={expandedIds}
          onExpandedIdsChange={setExpandedIds}
        />
      </div>
    );
  },
};

export const CustomIndent: RenderStory = {
  render: () => (
    <div style={{ width: 320 }}>
      <Tree data={sampleData} defaultExpandedIds={['org', 'eng']} indent={24} />
    </div>
  ),
};
