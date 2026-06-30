/**
 * @file apps/demo/src/pages/co/actuals/ActualsFilterBar.tsx
 * @description Fiscal / org / account filters for ActualsPage (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
 */

import type { ActualsFilterState } from './actuals.types';
import { useI18n } from '../../../i18n';
import styles from './ActualsFilterBar.module.css';

export interface ActualsFilterBarProps {
  value: ActualsFilterState;
  onChange: (next: ActualsFilterState) => void;
}

export function ActualsFilterBar({ value, onChange }: ActualsFilterBarProps) {
  const { t } = useI18n();

  return (
    <div className={styles.bar}>
      <label className={styles.field}>
        <span className={styles.label}>{t('page.actuals.filters.fiscalMonth')}</span>
        <input
          className={styles.input}
          value={value.fiscalMonth}
          placeholder="2026-01"
          onChange={(event) => onChange({ ...value, fiscalMonth: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{t('page.actuals.filters.organization')}</span>
        <input
          className={styles.input}
          value={value.orgCd}
          placeholder="HQ"
          onChange={(event) => onChange({ ...value, orgCd: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{t('page.actuals.filters.account')}</span>
        <input
          className={styles.input}
          value={value.acctCd}
          placeholder="4000"
          onChange={(event) => onChange({ ...value, acctCd: event.target.value })}
        />
      </label>
      <p className={styles.hint}>{t('page.actuals.filters.hint')}</p>
    </div>
  );
}
