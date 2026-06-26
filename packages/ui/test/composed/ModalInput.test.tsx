/**
 * @file packages/ui/test/composed/ModalInput.test.tsx
 * @description Tests for ModalInput composed family (C8).
 * @created 2026-06-25
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalInput } from '../../src/composed/modalInput/ModalInput';
import type { ModalInputSelection } from '../../src/composed/modalInput/ModalInput.types';

const items: ModalInputSelection[] = [
  { value: 'A', label: 'Alpha Corp', description: 'Seoul' },
  { value: 'B', label: 'Beta Trading', description: 'Busan' },
  { value: 'C', label: 'Gamma LLC', description: 'Tokyo', disabled: true },
];

describe('ModalInput', () => {
  it('opens modal from trigger button', async () => {
    const user = userEvent.setup();

    render(
      <ModalInput mode="single" items={items} placeholder="Pick vendor" title="Vendor lookup" />
    );

    await user.click(screen.getByRole('button', { name: 'Open search modal' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Vendor lookup')).toBeInTheDocument();
  });

  it('commits single selection on confirm', async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();

    render(
      <ModalInput
        mode="single"
        items={items}
        placeholder="Pick vendor"
        onCommit={onCommit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open search modal' }));
    await user.click(screen.getByRole('button', { name: /Beta Trading/i }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onCommit).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'B', label: 'Beta Trading' })
    );
  });

  it('filters local items in modal search', async () => {
    const user = userEvent.setup();

    render(<ModalInput mode="single" items={items} placeholder="Pick vendor" />);

    await user.click(screen.getByRole('button', { name: 'Open search modal' }));
    await user.type(screen.getByPlaceholderText('Search...'), 'beta');

    expect(screen.getByRole('button', { name: /Beta Trading/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Alpha Corp/i })).not.toBeInTheDocument();
  });

  it('commits multi selection on confirm', async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();

    render(
      <ModalInput mode="multi" items={items} placeholder="Pick vendors" onCommit={onCommit} />
    );

    await user.click(screen.getByRole('button', { name: 'Open search modal' }));
    await user.click(screen.getByRole('button', { name: /Alpha Corp/i }));
    await user.click(screen.getByRole('button', { name: /Beta Trading/i }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onCommit).toHaveBeenCalledWith([
      expect.objectContaining({ value: 'A' }),
      expect.objectContaining({ value: 'B' }),
    ]);
  });

  it('clears selection from trigger input', async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();

    render(
      <ModalInput
        mode="single"
        items={items}
        selectedItem={items[0]}
        onCommit={onCommit}
        clearable
      />
    );

    await user.hover(screen.getByDisplayValue('Alpha Corp'));
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onCommit).toHaveBeenCalledWith(null);
  });

  it('loads remote items via fetchItems', async () => {
    const user = userEvent.setup();
    const fetchItems = vi.fn(async () => items);

    render(
      <ModalInput mode="single" fetchItems={fetchItems} placeholder="Pick vendor" defaultOpen />
    );

    await waitFor(() => {
      expect(fetchItems).toHaveBeenCalled();
    });
    expect(screen.getByRole('button', { name: /Alpha Corp/i })).toBeInTheDocument();
  });

  it('cancels without committing', async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();

    render(
      <ModalInput
        mode="single"
        items={items}
        placeholder="Pick vendor"
        onCommit={onCommit}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open search modal' }));
    await user.click(screen.getByRole('button', { name: /Beta Trading/i }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('shows full selection in tooltip when selectedTooltip is auto', async () => {
    const user = userEvent.setup();

    render(
      <ModalInput
        mode="multi"
        items={items}
        selectedItems={[items[0], items[1], items[2]]}
        selectedTooltip="auto"
      />
    );

    await user.hover(screen.getByDisplayValue('Alpha Corp +2'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Alpha Corp, Beta Trading, Gamma LLC');
    });
  });

  it('does not show tooltip for single multi selection when selectedTooltip is auto', async () => {
    const user = userEvent.setup();

    render(
      <ModalInput
        mode="multi"
        items={items}
        selectedItems={[items[0]]}
        selectedTooltip="auto"
      />
    );

    await user.hover(screen.getByDisplayValue('Alpha Corp'));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('uses formatSelectedTooltip when provided', async () => {
    const user = userEvent.setup();

    render(
      <ModalInput
        mode="multi"
        items={items}
        selectedItems={[items[0], items[1]]}
        selectedTooltip={true}
        formatSelectedTooltip={(selected) => selected.map((item) => item.label).join(' / ')}
      />
    );

    await user.hover(screen.getByDisplayValue('Alpha Corp +1'));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Alpha Corp / Beta Trading');
    });
  });
});
