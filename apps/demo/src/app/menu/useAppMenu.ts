/**
 * @file apps/demo/src/app/menu/useAppMenu.ts
 * @description Load app menu from API or mock (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: useAppMenu
 *
 */

import { useEffect, useState } from 'react';
import { fetchAppMenu } from '../../shared/api/appMenuApi';
import type { AppMenuItem } from './menu.types';
import { MOCK_MENU_ITEMS } from './mockMenu';
import { useI18n } from '../../i18n';

interface UseAppMenuResult {
  items: AppMenuItem[];
  isLoading: boolean;
  error: Error | null;
}

export function useAppMenu(): UseAppMenuResult {
  const { t } = useI18n();
  const [items, setItems] = useState<AppMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAppMenu();
        if (!cancelled) {
          setItems(response.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(t('menu.loadError')));
          setItems(MOCK_MENU_ITEMS);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [t]);

  return { items, isLoading, error };
}
