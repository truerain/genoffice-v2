// packages/gen-datagrid/test/resolveEditLookup.test.ts
// Unit tests for lookup column resolution.

import { describe, expect, it, vi } from 'vitest';

import { isLookupColumn, resolveEditLookupConfig } from '../src/features/editing/resolveEditLookup';

describe('resolveEditLookup', () => {
  it('detects lookup columns from editType or editLookup', () => {
    expect(isLookupColumn({ editType: 'lookup' })).toBe(true);
    expect(isLookupColumn({ editLookup: { renderModal: () => null } })).toBe(true);
    expect(isLookupColumn({ editType: 'text', editLookup: { renderModal: () => null } })).toBe(true);
    expect(isLookupColumn({ editType: 'text' })).toBe(false);
  });

  it('resolves defaults for editLookup config', () => {
    const renderModal = vi.fn();
    const resolved = resolveEditLookupConfig({
      editType: 'lookup',
      editLookup: { renderModal },
    });

    expect(resolved).toEqual({
      mode: 'modal',
      allowCellEdit: false,
      getDisplayValue: undefined,
      mapSelection: undefined,
      renderModal,
      triggerAriaLabel: undefined,
    });
  });

  it('returns undefined when editType lookup has no editLookup', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(resolveEditLookupConfig({ editType: 'lookup' })).toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
