/**
 * @file packages/theme/src/provider/ThemeProvider.tsx
 * @description React context provider for light/dark mode and CSS variable theme tokens.
 * @created 2026-06-22
 */
import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { ThemeContextValue, ThemeMode, Theme } from '../types/theme.types';
import '../styles/global.css';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
  storageKey = 'gen-office-theme',
}) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }
    return defaultMode;
  });

  const readThemeFromCss = useCallback(
    (nextMode: ThemeMode): Theme => {
      if (typeof window === 'undefined') {
        return {
          mode: nextMode,
          colors: {
            background: { primary: '', secondary: '', tertiary: '' },
            foreground: { primary: '', secondary: '', tertiary: '', inverse: '' },
            brand: { primary: '', secondary: '' },
            status: { success: '', warning: '', error: '', info: '' },
            border: { default: '', subtle: '', strong: '' },
          },
        };
      }

      const root = document.documentElement;
      const styles = window.getComputedStyle(root);
      const getVar = (name: string) => styles.getPropertyValue(name).trim();

      return {
        mode: nextMode,
        colors: {
          background: {
            primary: getVar('--color-bg-primary'),
            secondary: getVar('--color-bg-secondary'),
            tertiary: getVar('--color-bg-tertiary'),
          },
          foreground: {
            primary: getVar('--color-fg-primary'),
            secondary: getVar('--color-fg-secondary'),
            tertiary: getVar('--color-fg-tertiary'),
            inverse: getVar('--color-fg-inverse'),
          },
          brand: {
            primary: getVar('--color-primary'),
            secondary: getVar('--color-brand-secondary'),
          },
          status: {
            success: getVar('--color-status-success'),
            warning: getVar('--color-status-warning'),
            error: getVar('--color-status-error'),
            info: getVar('--color-status-info'),
          },
          border: {
            default: getVar('--color-border-default'),
            subtle: getVar('--color-border-subtle'),
            strong: getVar('--color-border-strong'),
          },
        },
      };
    },
    []
  );

  const [theme, setTheme] = useState<Theme>(() => readThemeFromCss(mode));

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newMode);
      }
    },
    [storageKey]
  );

  const toggleMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  useEffect(() => {
    const root = document.documentElement;

    // Set data attribute for CSS selectors
    root.setAttribute('data-theme', mode);
    
    setTheme(readThemeFromCss(mode));
  }, [mode, readThemeFromCss]);

  const value: ThemeContextValue = {
    theme,
    mode,
    setMode,
    toggleMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
