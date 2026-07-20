'use client';

/**
 * @file apps/docs/src/lib/next-themes-compat.tsx
 * @description Drop-in `next-themes` shim for Fumadocs without client-rendered `<script>`.
 * @created 2026-07-13
 *
 * @remark
 * - React 19 / Next 16 warn when client components render `<script>`.
 * - FOUC prevention lives in `app/layout.tsx` `<head>` (Server Component) instead.
 * - Aliased via `next.config.mjs` `turbopack.resolveAlias['next-themes']`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Theme = string | undefined;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: string) => void;
  resolvedTheme: Theme;
  themes: string[];
  systemTheme: 'light' | 'dark' | undefined;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const MEDIA = '(prefers-color-scheme: dark)';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(MEDIA).matches ? 'dark' : 'light';
}

function applyThemeClass(
  theme: string,
  attribute: string | string[],
  enableColorScheme: boolean,
  value?: Record<string, string>,
) {
  const root = document.documentElement;
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  const token = value?.[resolved] ?? resolved;
  const attrs = Array.isArray(attribute) ? attribute : [attribute];

  for (const attr of attrs) {
    if (attr === 'class') {
      root.classList.remove('light', 'dark');
      if (token) root.classList.add(token);
    } else if (token) {
      root.setAttribute(attr, token);
    } else {
      root.removeAttribute(attr);
    }
  }

  if (enableColorScheme && (resolved === 'light' || resolved === 'dark')) {
    root.style.colorScheme = resolved;
  }
}

export type ThemeProviderProps = {
  children: ReactNode;
  attribute?: string | string[];
  defaultTheme?: string;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  themes?: string[];
  forcedTheme?: string;
  value?: Record<string, string>;
  nonce?: string;
};

export function ThemeProvider({
  children,
  attribute = 'data-theme',
  defaultTheme = 'system',
  enableSystem = true,
  enableColorScheme = true,
  storageKey = 'theme',
  themes = ['light', 'dark'],
  forcedTheme,
  value,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark' | undefined>(() =>
    typeof window === 'undefined' ? undefined : getSystemTheme(),
  );

  const setTheme = useCallback(
    (next: string) => {
      setThemeState(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  useEffect(() => {
    const media = window.matchMedia(MEDIA);
    const onChange = () => setSystemTheme(getSystemTheme());
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const active = forcedTheme ?? theme;
    applyThemeClass(active, attribute, enableColorScheme, value);
  }, [attribute, enableColorScheme, forcedTheme, theme, value]);

  const resolvedTheme =
    forcedTheme ?? (theme === 'system' && enableSystem ? systemTheme : theme);

  const ctx = useMemo<ThemeContextValue>(
    () => ({
      theme: forcedTheme ?? theme,
      setTheme,
      resolvedTheme,
      themes: enableSystem ? [...themes, 'system'] : themes,
      systemTheme: enableSystem ? systemTheme : undefined,
    }),
    [enableSystem, forcedTheme, resolvedTheme, setTheme, systemTheme, theme, themes],
  );

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: undefined,
      setTheme: () => undefined,
      resolvedTheme: undefined,
      themes: [],
      systemTheme: undefined,
    };
  }
  return ctx;
}
