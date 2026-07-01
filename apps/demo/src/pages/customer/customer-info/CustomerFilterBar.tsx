/**
 * @file apps/demo/src/pages/customer/customer-info/CustomerFilterBar.tsx
 * @description Customer list filter row (V1 SimpleFilterBar → V2 StandardFilterBar).
 * @created 2026-07-01
 *
 * @remark
 *
 */

import { StandardFilterBar, type FilterField } from '@gen-office/ui';

import { useI18n } from '../../../i18n';
import type { CustomerFilterState } from './customerInfo.types';

export interface CustomerFilterBarProps {
  value: CustomerFilterState;
  onChange: (next: CustomerFilterState) => void;
  onSearch: () => void;
}

export function CustomerFilterBar({ value, onChange, onSearch }: CustomerFilterBarProps) {
  const { t } = useI18n();

  const fields: FilterField<CustomerFilterState>[] = [
    {
      key: 'search',
      type: 'search',
      label: t('page.customerInfo.filters.search'),
      placeholder: t('page.customerInfo.filters.searchPlaceholder'),
      size: 'lg',
      simple: true,
    },
    {
      key: 'status',
      type: 'select',
      label: t('page.customerInfo.filters.status'),
      placeholder: t('page.customerInfo.filters.status'),
      size: 'sm',
      simple: true,
      options: [
        { value: 'all', label: t('page.customerInfo.filters.all') },
        { value: 'ACTIVE', label: t('page.customerInfo.filters.statusActive') },
        { value: 'INACTIVE', label: t('page.customerInfo.filters.statusInactive') },
        { value: 'PENDING', label: t('page.customerInfo.filters.statusPending') },
      ],
    },
    {
      key: 'grade',
      type: 'select',
      label: t('page.customerInfo.filters.grade'),
      placeholder: t('page.customerInfo.filters.grade'),
      size: 'sm',
      simple: true,
      options: [
        { value: 'all', label: t('page.customerInfo.filters.all') },
        { value: 'platinum', label: 'Platinum' },
        { value: 'gold', label: 'Gold' },
        { value: 'silver', label: 'Silver' },
        { value: 'bronze', label: 'Bronze' },
      ],
    },
  ];

  return (
    <StandardFilterBar
      value={value}
      fields={fields}
      onChange={onChange}
      onSearch={onSearch}
      searchLabel={t('page.customerInfo.filters.searchAction')}
    />
  );
}
