/**
 * @file packages/ui/src/composed/filterBar/FilterBar.types.ts
 * @description Public types for FilterBar and StandardFilterBar.
 * @created 2026-06-25
 *
 * @remark
 * - Exports: FilterBarProps, FilterBarItemProps, FilterBarFieldSize, FilterBarItemLayout, FilterField, …
 * - combo / multi-combo field types require Combobox (Wave C6) in StandardFilterBar
 * - date / month → DatePicker / MonthPicker (C5b)
 * - date-range / month-range → RangeDatePicker / RangeMonthPicker
 */
import type { ReactNode } from 'react';
import type { DateYmdSeparator } from '@gen-office/utils';

export type FilterBarItemLayout = 'vertical' | 'horizontal';

/** Preset field width on the 12-column filter grid */
export type FilterBarFieldSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fill';

/** Where action buttons (search, reset) render relative to filter fields */
export type FilterBarActionsPlacement = 'column' | 'inline';

/** Collapse toggle presentation */
export type FilterBarCollapseToggle = 'border' | 'actions-icon';

/** @deprecated Use `border` — bottom-edge chevron (divider mode removed) */
export type FilterBarCollapseToggleLegacy = FilterBarCollapseToggle | 'divider';

/** Shared collapse (simple/detail) options for FilterBar and StandardFilterBar */
export type FilterBarCollapseOptions = {
  /** When true, show a subset of fields until the user expands detail view */
  collapsible?: boolean;
  /** Max fields in simple mode when no field sets `simple`; default 3 */
  collapsedCount?: number;
  /** Start in detail (all fields) mode */
  defaultExpanded?: boolean;
  /** Controlled detail expanded state */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Toggle UI placement.
   * - `border` (default): chevron on bottom border — full panel (StandardFilterBar) or border-bottom only (borderless)
   * - `actions-icon`: compact chevron in actions column
   */
  collapseToggle?: FilterBarCollapseToggle | 'divider';
  /** Accessible name in simple mode; default `상세` */
  expandLabel?: string;
  /** Accessible name in detail mode; default `간단히` */
  collapseLabel?: string;
};

export interface FilterBarProps extends FilterBarCollapseOptions {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  /** Default label+control layout for all FilterBar.Item children */
  itemLayout?: FilterBarItemLayout;
  /** `column` (default): actions stacked in a column to the right of fields */
  actionsPlacement?: FilterBarActionsPlacement;
  /**
   * When true, parent supplies full panel border (StandardFilterBar).
   * Bottom-edge toggle skips extra border-bottom on FilterBar root.
   */
  borderedPanel?: boolean;
}

export interface FilterBarItemProps {
  /** Field label above or beside the control */
  label?: string;
  children: ReactNode;
  /** Preferred width preset (maps to theme `--filter-field-width-*`) */
  size?: FilterBarFieldSize;
  /**
   * @deprecated Prefer `size`. Legacy flex grow/shrink when `size` is omitted.
   */
  flex?: number;
  /**
   * @deprecated Prefer `size`. Legacy explicit width when `size` is omitted.
   */
  width?: string;
  className?: string;
  /** Label above control (default) or inline on the left */
  layout?: FilterBarItemLayout;
  /** Always visible in simple (collapsed) mode when `collapsible` */
  simple?: boolean;
}

export type FilterFieldOption = {
  label: string;
  value: string | number;
};

type FilterFieldBase<TFilters> = {
  key: keyof TFilters;
  /** Field label (maps to FilterBar.Item label) */
  label?: string;
  size?: FilterBarFieldSize;
  /** @deprecated Prefer `size` */
  flex?: number;
  /** @deprecated Prefer `size` */
  width?: string;
  className?: string;
  enterToSearch?: boolean;
  layout?: FilterBarItemLayout;
  /** Always visible in simple mode when bar is `collapsible` */
  simple?: boolean;
};

export type FilterField<TFilters> =
  | (FilterFieldBase<TFilters> & {
      type: 'text' | 'search' | 'select' | 'combo' | 'multi-combo';
      placeholder?: string;
      /** text · search — default true */
      clearable?: boolean;
      /** text · search — clear button aria-label */
      clearLabel?: string;
      options?: FilterFieldOption[];
    })
  | (FilterFieldBase<TFilters> & {
      type: 'date' | 'month';
      placeholder?: string;
      /** default true */
      clearable?: boolean;
      locale?: string;
      separator?: DateYmdSeparator;
      /** month only */
      fromMonth?: Date;
      /** month only */
      toMonth?: Date;
    })
  | (FilterFieldBase<TFilters> & {
      type: 'date-range' | 'month-range';
      placeholder?: string;
      /** default true */
      clearable?: boolean;
      locale?: string;
      formatOptions?: Intl.DateTimeFormatOptions;
      /** month-range only */
      fromMonth?: Date;
      /** month-range only */
      toMonth?: Date;
    })
  | (FilterFieldBase<TFilters> & {
      type: 'custom';
      render: (
        value: TFilters[keyof TFilters],
        onChange: (next: unknown) => void
      ) => ReactNode;
    });

export type StandardFilterBarProps<TFilters> = FilterBarCollapseOptions & {
  value: TFilters;
  fields: FilterField<TFilters>[];
  onChange: (next: TFilters) => void;
  actions?: ReactNode;
  onSearch?: () => void;
  searchLabel?: string;
  className?: string;
  /** Default layout for each field item */
  itemLayout?: FilterBarItemLayout;
  actionsPlacement?: FilterBarActionsPlacement;
};
