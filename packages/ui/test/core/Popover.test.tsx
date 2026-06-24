/**
 * @file packages/ui/test/core/Popover.test.tsx
 * @description Tests for Popover compound primitives.
 * @created 2026-06-24
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverTrigger, PopoverContent } from '../../src/core/popover/Popover';

describe('Popover', () => {
  it('opens content when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Popover body')).toBeInTheDocument();
  });
});
