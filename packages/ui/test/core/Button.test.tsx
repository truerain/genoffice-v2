/**
 * @file packages/ui/test/core/Button.test.tsx
 * @description Tests for Button (Wave 0 smoke + Gate baseline).
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../src/core/button/Button';

describe('Button', () => {
  it('renders and handles click', async () => {
    const user = userEvent.setup();
    let clicked = false;
    render(<Button onClick={() => { clicked = true; }}>Save</Button>);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(clicked).toBe(true);
  });

  it('respects disabled', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
