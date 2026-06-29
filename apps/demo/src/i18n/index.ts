/**
 * @file apps/demo/src/i18n/index.ts
 * @description i18n bootstrap — ko default, dot-key lookup (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: I18nProvider, useI18n, t, resolveMessage
 * - Key format: menu.placeholder (V1-compatible paths)
 *
 */

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import en from './locales/en';
import ko from './locales/ko';
import type { MessageTree } from './locales/ko';

export type Locale = 'ko' | 'en';

const dictionaries: Record<Locale, MessageTree> = {
  ko: ko as MessageTree,
  en,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedValue(tree: MessageTree, key: string): unknown {
  return key.split('.').reduce<unknown>((current, segment) => {
    if (current && typeof current === 'object' && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, tree);
}

export function resolveMessage(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const tree = dictionaries[locale];
  const value = getNestedValue(tree, key);
  if (typeof value !== 'string') {
    return key;
  }
  if (!params) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const replacement = params[name];
    return replacement !== undefined ? String(replacement) : `{{${name}}}`;
  });
}

export function I18nProvider({
  children,
  defaultLocale = 'ko',
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      resolveMessage(locale, key, params),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, t],
  );

  return createElement(I18nContext.Provider, { value }, children);
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
