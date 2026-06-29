/**
 * @file apps/demo/src/app/menu/MenuSidebar.tsx
 * @description Sidebar menu — click opens MDI tab via registry (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Flat list for D2 mock menu
 *
 */

import { useOpenPage } from '../hooks/useOpenPage';
import { resolveMenuTitle } from '../openPage';
import { useI18n } from '../../i18n';
import { useAppMenu } from './useAppMenu';
import styles from './MenuSidebar.module.css';

export function MenuSidebar() {
  const { t, locale } = useI18n();
  const { items, isLoading, error } = useAppMenu();
  const { openMenuItem } = useOpenPage();

  return (
    <nav className={styles.sidebar} aria-label={t('menu.title')}>
      <div className={styles.title}>{t('menu.title')}</div>
      {isLoading ? <p className={styles.status}>{t('common.loading')}</p> : null}
      {error ? <p className={styles.error}>{error.message}</p> : null}
      <ul className={styles.list}>
        {items.map((item) => {
          const label = resolveMenuTitle(item, locale);
          return (
            <li key={item.pageId}>
              <button
                type="button"
                className={styles.item}
                onClick={() => openMenuItem(item)}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
