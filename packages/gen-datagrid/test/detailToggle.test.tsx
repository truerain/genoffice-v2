// packages/gen-datagrid/test/detailToggle.test.tsx
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  hasVisibleCellContent,
  resolveCellContentVisibility,
} from '../src/features/master-detail/detailToggle';

type Row = { id: string; name: string };

describe('hasVisibleCellContent', () => {
  it('treats empty strings and booleans as not visible', () => {
    expect(hasVisibleCellContent('')).toBe(false);
    expect(hasVisibleCellContent('   ')).toBe(false);
    expect(hasVisibleCellContent(false)).toBe(false);
    expect(hasVisibleCellContent(true)).toBe(false);
    expect(hasVisibleCellContent(null)).toBe(false);
    expect(hasVisibleCellContent(undefined)).toBe(false);
  });
});

describe('resolveCellContentVisibility', () => {
  it('uses the column cell function output instead of TanStack flexRender wrapper', () => {
    const columns = [{ id: '_leading', header: '', cell: () => '' }];
    const data: Row[] = [{ id: '1', name: 'Ada' }];
    const { result } = renderHook(() =>
      useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
      })
    );

    const cell = result.current.getRowModel().rows[0]!.getVisibleCells()[0]!;

    expect(resolveCellContentVisibility(cell, <span />)).toBe(false);
  });
});
