/**
 * @file packages/ui/test/composed/TreeView.test.tsx
 * @description Tests for TreeView composed family (C9).
 * @created 2026-06-25
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeView } from '../../src/composed/treeView/TreeView';

type DemoNode = {
  id: string;
  parent_id: string | null;
  label: string;
};

const sampleData: DemoNode[] = [
  { id: 'root', parent_id: null, label: 'Root' },
  { id: 'child', parent_id: 'root', label: 'Child' },
  { id: 'leaf', parent_id: 'child', label: 'Leaf' },
];

describe('TreeView', () => {
  it('renders title and tree', () => {
    render(<TreeView data={sampleData} title="Org tree" />);

    expect(screen.getByText('Org tree')).toBeInTheDocument();
    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Root' })).toBeInTheDocument();
  });

  it('expands all branches from header control', async () => {
    const user = userEvent.setup();

    render(<TreeView data={sampleData} title="Org tree" />);

    expect(screen.queryByRole('button', { name: 'Child' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Expand all' }));

    expect(screen.getByRole('button', { name: 'Child' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Leaf' })).toBeInTheDocument();
  });

  it('collapses all branches from header control', async () => {
    const user = userEvent.setup();

    render(
      <TreeView data={sampleData} title="Org tree" defaultExpandedIds={['root', 'child']} />
    );

    expect(screen.getByRole('button', { name: 'Child' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Collapse all' }));

    expect(screen.queryByRole('button', { name: 'Child' })).not.toBeInTheDocument();
  });

  it('calls onSelect when a node is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <TreeView
        data={sampleData}
        defaultExpandedIds={['root', 'child']}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Leaf' }));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'leaf', label: 'Leaf' })
    );
  });

  it('hides header controls when showControls is false', () => {
    render(<TreeView data={sampleData} showControls={false} />);

    expect(screen.queryByRole('button', { name: 'Expand all' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Collapse all' })).not.toBeInTheDocument();
  });
});
