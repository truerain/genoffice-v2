/**
 * @file packages/ui/test/core/MaskedInput.test.tsx
 * @description Tests for MaskedInput.
 * @created 2026-06-25
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MaskedInput } from '../../src/core/maskedInput';

describe('MaskedInput', () => {
  it('formats ymd digits while typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MaskedInput
        label="Date"
        mask="ymd"
        onChange={onChange}
        autoSelect={false}
      />
    );

    const input = screen.getByLabelText('Date');
    await user.type(input, '20260625');

    expect(input).toHaveValue('2026-06-25');
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls.at(-1);
    expect(lastCall?.[1].complete).toBe(true);
  });

  it('formats ym preset', async () => {
    const user = userEvent.setup();

    render(<MaskedInput label="Month" mask="ym" autoSelect={false} />);

    const input = screen.getByLabelText('Month');
    await user.type(input, '202606');

    expect(input).toHaveValue('2026-06');
  });

  it('clears masked value', async () => {
    const user = userEvent.setup();

    render(
      <MaskedInput
        label="Date"
        mask="ymd"
        defaultValue="2026-06-25"
        clearable
        autoSelect={false}
      />
    );

    const input = screen.getByLabelText('Date');
    await user.click(input);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(input).toHaveValue('');
  });

  it('normalizes pasted date text', async () => {
    const user = userEvent.setup();

    render(<MaskedInput label="Date" mask="ymd" autoSelect={false} />);

    const input = screen.getByLabelText('Date');
    await user.click(input);
    await user.paste('2026/06/25');

    expect(input).toHaveValue('2026-06-25');
  });

  it('calls onComplete when mask is filled', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <MaskedInput
        label="Date"
        mask="ymd"
        onComplete={onComplete}
        autoSelect={false}
      />
    );

    await user.type(screen.getByLabelText('Date'), '20260625');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('renders suffix slot', () => {
    render(
      <MaskedInput
        label="Date"
        mask="ymd"
        suffix={<button type="button">Cal</button>}
        autoSelect={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Cal' })).toBeInTheDocument();
  });
});
