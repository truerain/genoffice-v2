/**
 * @file packages/theme/test/useTheme.test.tsx
 * @description Tests for useTheme hook context contract.
 * @created 2026-06-22
 */
import { describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '../src/provider/ThemeProvider';
import { useTheme } from '../src/hooks/useTheme';

function ThemeConsumer() {
  const { mode, toggleMode } = useTheme();
  return (
    <button type="button" onClick={toggleMode}>
      mode:{mode}
    </button>
  );
}

describe('useTheme', () => {
  afterEach(() => {
    cleanup();
  });

  it('throws when used outside ThemeProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<ThemeConsumer />)).toThrow(
      'useTheme must be used within a ThemeProvider',
    );

    consoleError.mockRestore();
  });

  it('returns context values inside ThemeProvider', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultMode="light" storageKey="test-use-theme">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'mode:light' })).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button', { name: 'mode:dark' })).toBeInTheDocument();
  });
});
