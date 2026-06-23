/**
 * @file packages/theme/src/types/theme.types.ts
 * @description TypeScript types for theme mode, color tokens, and context value.
 * @created 2026-06-22
 */
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    foreground: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    primary: {
      default: string;
      light: string;
      dark: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    border: {
      default: string;
      subtle: string;
      strong: string;
    };
  };
}

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}
