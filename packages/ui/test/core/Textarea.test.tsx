/**
 * @file packages/ui/test/core/Textarea.test.tsx
 * @description Tests for Textarea.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../../src/core/textarea/Textarea';
import styles from '../../src/core/textarea/Textarea.module.css';

describe('Textarea', () => {
  it('renders with label and helper text', () => {
    render(<Textarea label="Notes" helperText="Optional" placeholder="..." />);
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('sets aria-invalid when error', () => {
    render(<Textarea label="Feedback" error defaultValue="x" />);
    expect(screen.getByLabelText('Feedback')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies resize class', () => {
    render(<Textarea label="Body" resize="none" />);
    expect(screen.getByLabelText('Body')).toHaveClass(styles.resizeNone);
  });

  it('accepts user typing', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Message" />);
    const field = screen.getByLabelText('Message');
    await user.type(field, 'Hi');
    expect(field).toHaveValue('Hi');
  });
});
