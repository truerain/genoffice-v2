/**
 * @file packages/theme/test/ThemeProvider.test.tsx
 * @description Tests for ThemeProvider mode, DOM attribute, and persistence.
 * @created 2026-06-22
 */
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '../src/provider/ThemeProvider';
import { useTheme } from '../src/hooks/useTheme';

function ModeControls() {
  const { mode, setMode } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button type="button" onClick={() => setMode('dark')}>
        set-dark
      </button>
      <button type="button" onClick={() => setMode('light')}>
        set-light
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  const storageKey = 'test-theme-provider';

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    cleanup();
  });

  it('sets data-theme on documentElement', async () => {
    render(
      <ThemeProvider defaultMode="light" storageKey={storageKey}>
        <ModeControls />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  it('restores mode from localStorage', () => {
    localStorage.setItem(storageKey, 'dark');

    render(
      <ThemeProvider defaultMode="light" storageKey={storageKey}>
        <ModeControls />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('persists setMode to localStorage and updates data-theme', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultMode="light" storageKey={storageKey}>
        <ModeControls />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'set-dark' }));

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(localStorage.getItem(storageKey)).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('exposes primary color read from CSS variables', async () => {
    let capturedPrimary = '';

    function ColorProbe() {
      const { theme } = useTheme();
      capturedPrimary = theme.colors.primary.default;
      return null;
    }

    render(
      <ThemeProvider defaultMode="light" storageKey={`${storageKey}-css`}>
        <ColorProbe />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(capturedPrimary).not.toBe('');
    });
    expect(capturedPrimary.toLowerCase()).toMatch(/#c6004d|rgb\(198,\s*0,\s*77\)/);
  });
});
