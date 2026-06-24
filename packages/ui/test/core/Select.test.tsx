/**
 * @file packages/ui/test/core/Select.test.tsx
 * @description Tests for Select compound primitives.
 * @created 2026-06-24
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../src/core/select/Select';

describe('Select', () => {
  it('renders combobox trigger', () => {
    render(
      <Select>
        <SelectTrigger aria-label="Choose item">
          <SelectValue placeholder="Choose item" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByRole('combobox', { name: 'Choose item' })).toBeInTheDocument();
  });
});
