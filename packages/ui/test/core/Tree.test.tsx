/**
 * @file packages/ui/test/core/Tree.test.tsx
 * @description Tests for Tree hierarchical list.
 * @created 2026-06-24
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tree } from '../../src/core/tree/Tree';

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

describe('Tree', () => {
  it('renders root nodes', () => {
    render(<Tree data={sampleData} />);

    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Root' })).toBeInTheDocument();
  });

  it('expands and collapses branches', async () => {
    const user = userEvent.setup();

    render(<Tree data={sampleData} defaultExpandedIds={['root']} />);

    expect(screen.getByRole('button', { name: 'Child' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Collapse' }));
    expect(screen.queryByRole('button', { name: 'Child' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Expand' }));
    expect(screen.getByRole('button', { name: 'Child' })).toBeInTheDocument();
  });

  it('calls onSelect when a node label is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Tree
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
});
