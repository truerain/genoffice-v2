/**
 * @file packages/ui/test/composed/Combobox.test.tsx
 * @description Tests for Combobox composed family (C6).
 * @created 2026-06-25
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from '../../src/composed/comboBox/Combobox';
import { MultiCombobox } from '../../src/composed/comboBox/MultiCombobox';
import type { ComboboxOption } from '../../src/composed/comboBox/Combobox.types';

const options: ComboboxOption[] = [
  { label: 'Alpha', value: 'A' },
  { label: 'Beta', value: 'B' },
  { label: 'Gamma', value: 'C' },
];

describe('Combobox', () => {
  it('filters options while typing', async () => {
    const user = userEvent.setup();

    render(<Combobox options={options} placeholder="Pick one" />);

    const input = screen.getByPlaceholderText('Pick one');
    await user.click(input);
    await user.type(input, 'be');

    expect(screen.getByRole('option', { name: 'Beta' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Alpha' })).not.toBeInTheDocument();
  });

  it('calls onValueChange when option is selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Combobox options={options} placeholder="Pick one" onValueChange={onValueChange} />
    );

    await user.click(screen.getByPlaceholderText('Pick one'));
    await user.click(screen.getByRole('option', { name: 'Beta' }));

    expect(onValueChange).toHaveBeenCalledWith('B', expect.objectContaining({ label: 'Beta' }));
  });

  it('clears value when clearable', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Combobox
        options={options}
        value="A"
        clearable
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByDisplayValue('Alpha');
    await user.click(input);
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onValueChange).toHaveBeenCalledWith('', null);
  });
});

describe('MultiCombobox', () => {
  it('toggles selection on option click', async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();

    render(
      <MultiCombobox
        options={options}
        values={['A']}
        placeholder="Pick many"
        onValuesChange={onValuesChange}
      />
    );

    await user.click(screen.getByPlaceholderText('Pick many'));
    await user.click(screen.getByRole('option', { name: 'Beta' }));

    expect(onValuesChange).toHaveBeenCalledWith(
      ['A', 'B'],
      expect.arrayContaining([
        expect.objectContaining({ value: 'A' }),
        expect.objectContaining({ value: 'B' }),
      ])
    );
  });

  it('clears all selections when clearable', async () => {
    const user = userEvent.setup();
    const onValuesChange = vi.fn();

    render(
      <MultiCombobox
        options={options}
        values={['A', 'B']}
        clearable
        onValuesChange={onValuesChange}
      />
    );

    const input = screen.getByDisplayValue('Alpha +1');
    await user.hover(input);
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onValuesChange).toHaveBeenCalledWith([], []);
  });

  it('shows full selection in tooltip when selectedTooltip is auto', async () => {
    const user = userEvent.setup();

    render(
      <MultiCombobox
        options={options}
        values={['A', 'B', 'C']}
        selectedTooltip="auto"
      />
    );

    await user.hover(screen.getByDisplayValue('Alpha +2'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Alpha, Beta, Gamma');
    });
  });

  it('does not show tooltip for single selection when selectedTooltip is auto', async () => {
    const user = userEvent.setup();

    render(
      <MultiCombobox options={options} values={['A']} selectedTooltip="auto" />
    );

    await user.hover(screen.getByDisplayValue('Alpha'));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('uses formatSelectedTooltip when provided', async () => {
    const user = userEvent.setup();

    render(
      <MultiCombobox
        options={options}
        values={['A', 'B']}
        selectedTooltip={true}
        formatSelectedTooltip={(selected) => selected.map((o) => o.label).join(' / ')}
      />
    );

    await user.hover(screen.getByDisplayValue('Alpha +1'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Alpha / Beta');
    });
  });
});
