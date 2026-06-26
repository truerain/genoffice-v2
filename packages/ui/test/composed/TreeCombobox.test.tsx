/**
 * @file packages/ui/test/composed/TreeCombobox.test.tsx
 * @description Tests for TreeCombobox composed family (C7).
 * @created 2026-06-25
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeCombobox } from '../../src/composed/treeCombobox/TreeCombobox';
import type { TreeComboboxOption } from '../../src/composed/treeCombobox/TreeCombobox.types';
import { StandardFilterBar } from '../../src/composed/filterBar';

const treeOptions: TreeComboboxOption[] = [
  { id: 'hq', parentId: null, value: 'HQ', label: 'Headquarters' },
  { id: 'sales', parentId: 'hq', value: 'SALES', label: 'Sales Division' },
  { id: 'finance', parentId: 'hq', value: 'FINANCE', label: 'Finance Division' },
  { id: 'east', parentId: 'sales', value: 'EAST', label: 'East Region' },
  { id: 'seoul', parentId: 'east', value: 'SEOUL', label: 'Seoul Office' },
];

describe('TreeCombobox', () => {
  it('selects a tree node', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeCombobox
        options={treeOptions}
        placeholder="Pick org"
        defaultExpandedIds={['hq', 'sales', 'east']}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByPlaceholderText('Pick org'));
    await user.click(screen.getByRole('treeitem', { name: 'Seoul Office' }));

    expect(onValueChange).toHaveBeenCalledWith(
      'SEOUL',
      expect.objectContaining({ label: 'Seoul Office' })
    );
  });

  it('expands root nodes on first open by default', async () => {
    const user = userEvent.setup();

    render(<TreeCombobox options={treeOptions} placeholder="Pick org" />);

    await user.click(screen.getByPlaceholderText('Pick org'));
    expect(screen.getByRole('treeitem', { name: 'Sales Division' })).toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: 'Finance Division' })).toBeInTheDocument();
  });

  it('expands a parent node manually when expandRootsOnOpen is false', async () => {
    const user = userEvent.setup();

    render(
      <TreeCombobox
        options={treeOptions}
        placeholder="Pick org"
        expandRootsOnOpen={false}
      />
    );

    await user.click(screen.getByPlaceholderText('Pick org'));
    expect(screen.queryByRole('treeitem', { name: 'Sales Division' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Expand node' }));
    expect(screen.getByRole('treeitem', { name: 'Sales Division' })).toBeInTheDocument();
  });

  it('does not select branch nodes when selectLeafOnly is true', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeCombobox
        options={treeOptions}
        placeholder="Pick org"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByPlaceholderText('Pick org'));
    await user.click(screen.getByRole('treeitem', { name: 'Headquarters' }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('treeitem', { name: 'Sales Division' })).toBeInTheDocument();
  });

  it('allows branch selection when selectLeafOnly is false', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeCombobox
        options={treeOptions}
        placeholder="Pick org"
        selectLeafOnly={false}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByPlaceholderText('Pick org'));
    await user.click(screen.getByRole('treeitem', { name: 'Headquarters' }));

    expect(onValueChange).toHaveBeenCalledWith(
      'HQ',
      expect.objectContaining({ label: 'Headquarters' })
    );
  });

  it('selects leaf nodes by default', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeCombobox
        options={treeOptions}
        placeholder="Pick org"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByPlaceholderText('Pick org'));
    await user.click(screen.getByRole('treeitem', { name: 'Finance Division' }));

    expect(onValueChange).toHaveBeenCalledWith(
      'FINANCE',
      expect.objectContaining({ label: 'Finance Division' })
    );
  });

  it('filters nodes and shows matching ancestors', async () => {
    const user = userEvent.setup();

    render(<TreeCombobox options={treeOptions} placeholder="Pick org" />);

    const input = screen.getByPlaceholderText('Pick org');
    await user.click(input);
    await user.type(input, 'seoul');

    expect(screen.getByRole('treeitem', { name: 'Headquarters' })).toBeInTheDocument();
    expect(screen.getByRole('treeitem', { name: 'Seoul Office' })).toBeInTheDocument();
  });

  it('clears value when clearable', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TreeCombobox
        options={treeOptions}
        value="HQ"
        clearable
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByDisplayValue('Headquarters');
    await user.click(input);
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onValueChange).toHaveBeenCalledWith('', null);
  });
});

describe('StandardFilterBar tree-combo', () => {
  it('renders tree-combo field and updates value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <StandardFilterBar
        value={{ org: '' }}
        fields={[
          {
            key: 'org',
            label: 'Organization',
            type: 'tree-combo',
            placeholder: 'Pick org',
            treeOptions,
            size: 'md',
          },
        ]}
        onChange={onChange}
      />
    );

    expect(screen.getByText('Organization')).toBeInTheDocument();
    await user.click(screen.getByPlaceholderText('Pick org'));
    await user.click(screen.getByRole('treeitem', { name: 'Finance Division' }));
    expect(onChange).toHaveBeenCalledWith({ org: 'FINANCE' });
  });
});
