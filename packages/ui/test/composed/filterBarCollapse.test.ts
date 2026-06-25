/**
 * @file packages/ui/test/composed/filterBarCollapse.test.ts
 * @description Tests for FilterBar collapse helpers.
 * @created 2026-06-25
 */
import { describe, expect, it } from 'vitest';
import {
  filterFieldsForCollapse,
  shouldShowCollapseToggle,
} from '../../src/composed/filterBar/filterBarCollapse';

describe('filterBarCollapse', () => {
  it('shows toggle when field count exceeds collapsedCount', () => {
    expect(shouldShowCollapseToggle(6, 3, true, 0)).toBe(true);
    expect(shouldShowCollapseToggle(3, 3, true, 0)).toBe(false);
    expect(shouldShowCollapseToggle(6, 3, false, 0)).toBe(false);
  });

  it('uses simple-marked fields in collapsed mode', () => {
    const fields = [
      { key: 'a', simple: true },
      { key: 'b' },
      { key: 'c' },
    ];

    expect(filterFieldsForCollapse(fields, false, 3)).toEqual([{ key: 'a', simple: true }]);
    expect(filterFieldsForCollapse(fields, true, 3)).toEqual(fields);
    expect(shouldShowCollapseToggle(3, 3, true, 1)).toBe(true);
  });

  it('slices by collapsedCount when no simple markers', () => {
    const fields = [{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }];
    expect(filterFieldsForCollapse(fields, false, 2)).toEqual([{ key: 'a' }, { key: 'b' }]);
  });
});
