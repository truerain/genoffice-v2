/**
 * @file packages/gen-datagrid/test/createBuiltinTextEditor.test.tsx
 * @description Gate 4.3-d createBuiltinTextEditor factory interaction coverage.
 * @created 2026-07-12
 */
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GenDataGrid, createBuiltinTextEditor } from '../src/index';

const rows = [
  { id: '1', name: 'Ada', age: 36 },
  { id: '2', name: 'Grace', age: 45 },
];

function getCell(container: HTMLElement, rowId: string, columnId: string) {
  const cell = container.querySelector<HTMLElement>(
    `[data-gen-datagrid-cell="true"][data-cell-kind="body"][data-rowid="${rowId}"][data-colid="${columnId}"]`
  );
  if (!cell) throw new Error(`Missing cell ${rowId}/${columnId}`);
  return cell;
}

describe('createBuiltinTextEditor', () => {
  it('renders via renderEditor with built-in keyboard commit on Enter', async () => {
    const onCellValueChange = vi.fn();
    const columns = [
      {
        accessorKey: 'name',
        header: 'Name',
        size: 120,
        meta: {
          editable: true,
          editType: 'text' as const,
          editMaxLength: 8,
          renderEditor: createBuiltinTextEditor({ className: 'factory-editor' }),
        },
      },
      { accessorKey: 'age', header: 'Age', size: 80 },
    ];

    const { container } = render(
      <GenDataGrid
        gridId="builtin-text-factory-grid"
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        onCellValueChange={onCellValueChange}
      />
    );

    const cell = getCell(container, '1', 'name');
    fireEvent.doubleClick(cell);
    const editor = cell.querySelector<HTMLInputElement>('input.factory-editor');
    if (!editor) throw new Error('Missing factory editor');

    expect(editor.classList.contains('gen-datagrid__editor')).toBe(true);

    fireEvent.change(editor, { target: { value: 'AdaLovelace' } });
    await waitFor(() => {
      expect(editor.value).toBe('AdaLovel');
    });

    fireEvent.keyDown(editor, { key: 'Enter' });
    await waitFor(() => {
      expect(onCellValueChange).toHaveBeenCalledWith(
        expect.objectContaining({
          rowId: '1',
          columnId: 'name',
          value: 'AdaLovel',
        })
      );
    });
  });
});
