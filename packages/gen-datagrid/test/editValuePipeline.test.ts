/**
 * @file packages/gen-datagrid/test/editValuePipeline.test.ts
 * @description Unit tests for edit value helpers (Gate 4.3).
 * @created 2026-07-12
 */
import { describe, expect, it } from 'vitest';
import {
  createEditValueHandlers,
  matchesEditPattern,
  resolveEditPattern,
  resolveSelectEditOptions,
} from '../src/features/editing/editValuePipeline';
import type { GenDataGridEditableContext } from '../src/GenDataGrid.types';

const editableContext = {
  row: { id: '1' },
  rowId: '1',
  rowIndex: 0,
  columnId: 'name',
  value: 'Alice',
  rowStatus: 'clean',
} as GenDataGridEditableContext<{ id: string }>;

describe('resolveSelectEditOptions', () => {
  const options = [
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ];

  it('returns base options when clearable meta is absent', () => {
    expect(resolveSelectEditOptions(options)).toEqual(options);
  });

  it('prepends editEmptyOption', () => {
    expect(
      resolveSelectEditOptions(options, {
        editEmptyOption: { label: '(없음)', value: '' },
      })
    ).toEqual([{ label: '(없음)', value: '' }, ...options]);
  });

  it('defaults empty option value to empty string', () => {
    expect(
      resolveSelectEditOptions(options, {
        editEmptyOption: { label: 'Clear' },
      })
    ).toEqual([{ label: 'Clear', value: '' }, ...options]);
  });

  it('prepends blank option when editSelectClearable is true', () => {
    expect(resolveSelectEditOptions(options, { editSelectClearable: true })).toEqual([
      { label: '', value: '' },
      ...options,
    ]);
  });

  it('does not duplicate an existing empty value', () => {
    const withEmpty = [{ label: 'None', value: '' }, ...options];
    expect(
      resolveSelectEditOptions(withEmpty, {
        editEmptyOption: { label: '(없음)', value: '' },
        editSelectClearable: true,
      })
    ).toEqual(withEmpty);
  });
});

describe('resolveEditPattern / matchesEditPattern', () => {
  it('resolves preset ids to RegExp', () => {
    expect(resolveEditPattern('digitsOnly')?.source).toBe('^\\d*$');
    expect(resolveEditPattern('alphanumeric')).toBeInstanceOf(RegExp);
    expect(resolveEditPattern('lettersOnly')).toBeInstanceOf(RegExp);
  });

  it('passes through RegExp instances', () => {
    const pattern = /^[A-Z]*$/;
    expect(resolveEditPattern(pattern)).toBe(pattern);
  });

  it('allows empty string even when pattern would reject it', () => {
    expect(matchesEditPattern('', /^[A-Z]+$/)).toBe(true);
  });
});

describe('createEditValueHandlers editPattern', () => {
  it('rejects inbound values that fail the pattern and keeps previous', () => {
    const { applyInbound } = createEditValueHandlers({
      meta: { editType: 'text', editPattern: 'digitsOnly' },
      editableContext,
    });

    expect(applyInbound('12', '1')).toBe('12');
    expect(applyInbound('12a', '12')).toBe('12');
    expect(applyInbound('abc')).toBe('');
  });

  it('keeps previous cell value on paste commit when pattern fails', () => {
    const { applyCommit } = createEditValueHandlers({
      meta: { editType: 'text', editPattern: /^[A-Za-z]*$/ },
      editableContext,
    });

    expect(applyCommit('Bob', 'Alice')).toBe('Bob');
    expect(applyCommit('Bob1', 'Alice')).toBe('Alice');
  });

  it('applies pattern after maxLength', () => {
    const { applyInbound } = createEditValueHandlers({
      meta: { editType: 'text', editMaxLength: 3, editPattern: 'digitsOnly' },
      editableContext,
    });

    expect(applyInbound('12345', '')).toBe('123');
    expect(applyInbound('12a', '12')).toBe('12');
  });
});
