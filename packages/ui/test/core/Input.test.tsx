/**
 * @file packages/ui/test/core/Input.test.tsx
 * @description Tests for Input.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../../src/core/input/Input';

describe('Input', () => {
  it('renders with label and helper text', () => {
    render(<Input label="Email" helperText="Work email only" placeholder="you@co.com" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(screen.getByText('Work email only')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-helper'));
  });

  it('sets aria-invalid when error', () => {
    render(<Input label="Email" error defaultValue="bad" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears value when clearable', async () => {
    const user = userEvent.setup();
    render(<Input label="Search" clearable defaultValue="hello" autoSelect={false} />);
    const input = screen.getByLabelText('Search');
    await user.click(input);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(input).toHaveValue('');
  });

  it('accepts user typing when uncontrolled', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" autoSelect={false} />);
    const input = screen.getByLabelText('Name');
    await user.type(input, 'Ada');
    expect(input).toHaveValue('Ada');
  });
});
