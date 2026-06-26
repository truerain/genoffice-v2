/**
 * @file packages/ui/src/composed/filterBar/StandardFilterBar.tsx
 * @description Declarative filter row built on FilterBar and core form controls.
 * @created 2026-06-25
 *
 * @remark
 * - V1 SimpleFilterBar port; uses FilterBar + FilterField[]
 * - combo / multi-combo: Combobox / MultiCombobox (C6)
 * - tree-combo: TreeCombobox (C7)
 * - date / month: DatePicker / MonthPicker (fullWidth anchor)
 * - date-range / month-range: RangeDatePicker / RangeMonthPicker
 * - Default chrome: bordered panel via StandardFilterBar.module.css
 * - collapsible: simple/detail field subset via FilterBar collapse props
 */
import { Search } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../../core/button';
import { Input } from '../../core/input';
import { StandardSelect } from '../../core/select';
import { DatePicker } from '../datePicker/DatePicker';
import { MonthPicker } from '../datePicker/MonthPicker';
import { RangeDatePicker } from '../datePicker/RangeDatePicker';
import { RangeMonthPicker } from '../datePicker/RangeMonthPicker';
import type { DateRange } from '../datePicker/RangeDatePicker.types';
import type { MonthRange } from '../datePicker/RangeMonthPicker.types';
import { FilterBar } from './FilterBar';
import { DEFAULT_COLLAPSED_COUNT } from './filterBarCollapse';
import type { FilterField, StandardFilterBarProps } from './FilterBar.types';
import { SearchInput } from './SearchInput';
import { Combobox } from '../combobox/Combobox';
import { MultiCombobox } from '../combobox/MultiCombobox';
import type { ComboboxOption } from '../combobox/Combobox.types';
import { TreeCombobox } from '../treeCombobox/TreeCombobox';
import styles from './StandardFilterBar.module.css';

function mapFilterOptions(options?: { label: string; value: string | number }[]): ComboboxOption[] {
  return (options ?? []).map((opt) => ({
    label: opt.label,
    value: String(opt.value),
  }));
}

function asOptionalDate(value: unknown): Date | undefined {
  return value instanceof Date && !Number.isNaN(value.getTime()) ? value : undefined;
}

function asDateRange(value: unknown): DateRange | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const range = value as DateRange;
  const from = asOptionalDate(range.from);
  const to = asOptionalDate(range.to);
  if (!from && !to) return undefined;
  return { from, to };
}

function asMonthRange(value: unknown): MonthRange | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const range = value as MonthRange;
  const from = asOptionalDate(range.from);
  const to = asOptionalDate(range.to);
  if (!from && !to) return undefined;
  return { from, to };
}

function renderDefaultField<TFilters>(
  field: FilterField<TFilters>,
  value: TFilters,
  onChange: (next: TFilters) => void,
  onSearch?: () => void
) {
  if (field.type === 'custom') return null;

  const key = field.key;
  const fieldValue = value[key] as unknown;
  const setFieldValue = (nextValue: unknown) => {
    onChange({ ...value, [key]: nextValue } as TFilters);
  };

  switch (field.type) {
    case 'search':
      return (
        <SearchInput
          value={String(fieldValue ?? '')}
          onChange={(next) => setFieldValue(next)}
          placeholder={field.placeholder}
          className={field.className}
          clearable={field.clearable ?? true}
          clearLabel={field.clearLabel}
        />
      );
    case 'select':
      return (
        <StandardSelect
          value={String(fieldValue ?? '')}
          onValueChange={(next) => setFieldValue(next)}
          placeholder={field.placeholder}
          fullWidth
          options={(field.options ?? []).map((opt) => ({
            label: opt.label,
            value: String(opt.value),
          }))}
        />
      );
    case 'combo':
      return (
        <Combobox
          value={String(fieldValue ?? '')}
          onValueChange={(next) => setFieldValue(next)}
          placeholder={field.placeholder}
          options={mapFilterOptions(field.options)}
          clearable={field.clearable ?? true}
          clearLabel={field.clearLabel}
          fullWidth
        />
      );
    case 'multi-combo': {
      const multiValue = Array.isArray(fieldValue)
        ? fieldValue.map(String)
        : fieldValue
          ? [String(fieldValue)]
          : [];
      return (
        <MultiCombobox
          values={multiValue}
          onValuesChange={(next) => setFieldValue(next)}
          placeholder={field.placeholder}
          options={mapFilterOptions(field.options)}
          clearable={field.clearable ?? true}
          clearLabel={field.clearLabel}
          fullWidth
        />
      );
    }
    case 'tree-combo':
      return (
        <TreeCombobox
          value={String(fieldValue ?? '')}
          onValueChange={(next) => setFieldValue(next)}
          placeholder={field.placeholder}
          options={field.treeOptions}
          clearable={field.clearable ?? true}
          clearLabel={field.clearLabel}
          fullWidth
          selectLeafOnly={field.selectLeafOnly}
        />
      );
    case 'date':
      return (
        <DatePicker
          value={asOptionalDate(fieldValue)}
          onChange={(next) => setFieldValue(next)}
          placeholder={field.placeholder}
          clearable={field.clearable ?? true}
          locale={field.locale}
          separator={field.separator}
          fullWidth
        />
      );
    case 'month':
      return (
        <MonthPicker
          value={asOptionalDate(fieldValue)}
          onChange={(next) => setFieldValue(next)}
          placeholder={field.placeholder}
          clearable={field.clearable ?? true}
          locale={field.locale}
          separator={field.separator}
          fromMonth={field.fromMonth}
          toMonth={field.toMonth}
          fullWidth
        />
      );
    case 'date-range':
      return (
        <RangeDatePicker
          value={asDateRange(fieldValue)}
          onChange={(next) => setFieldValue(next)}
          placeholder={field.placeholder}
          clearable={field.clearable ?? true}
          locale={field.locale}
          formatOptions={field.formatOptions}
          fullWidth
        />
      );
    case 'month-range':
      return (
        <RangeMonthPicker
          value={asMonthRange(fieldValue)}
          onChange={(next) => setFieldValue(next)}
          placeholder={field.placeholder}
          clearable={field.clearable ?? true}
          locale={field.locale}
          fromMonth={field.fromMonth}
          toMonth={field.toMonth}
          fullWidth
        />
      );
    case 'text':
    default:
      return (
        <Input
          value={String(fieldValue ?? '')}
          onChange={(e) => setFieldValue(e.target.value)}
          onKeyDown={(e) => {
            if (!field.enterToSearch || !onSearch) return;
            if (e.key !== 'Enter') return;
            if (e.nativeEvent.isComposing) return;
            e.preventDefault();
            onSearch();
          }}
          placeholder={field.placeholder}
          className={field.className}
          fullWidth
          clearable={field.clearable ?? true}
          clearLabel={field.clearLabel}
        />
      );
  }
}

export function StandardFilterBar<TFilters>({
  value,
  fields,
  onChange,
  actions,
  onSearch,
  searchLabel = 'Search',
  className,
  itemLayout = 'vertical',
  actionsPlacement = 'column',
  collapsible = false,
  collapsedCount = DEFAULT_COLLAPSED_COUNT,
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  expandLabel,
  collapseLabel,
  collapseToggle = 'border',
}: StandardFilterBarProps<TFilters>) {
  const resolvedActions =
    actions ??
    (onSearch ? (
      <Button onClick={onSearch} variant="primary" size="md">
        <Search size={16} aria-hidden />
        {searchLabel}
      </Button>
    ) : null);

  return (
    <FilterBar
      actions={resolvedActions}
      className={clsx(styles.root, className)}
      borderedPanel
      itemLayout={itemLayout}
      actionsPlacement={actionsPlacement}
      collapsible={collapsible}
      collapsedCount={collapsedCount}
      defaultExpanded={defaultExpanded}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
      collapseToggle={collapseToggle}
      expandLabel={expandLabel}
      collapseLabel={collapseLabel}
    >
      {fields.map((field) => (
        <FilterBar.Item
          key={String(field.key)}
          label={field.label}
          size={field.size}
          flex={field.flex}
          width={field.width}
          className={field.className}
          layout={field.layout}
          simple={field.simple}
        >
          {field.type === 'custom'
            ? field.render(value[field.key], (next) =>
                onChange({ ...value, [field.key]: next } as TFilters)
              )
            : renderDefaultField(field, value, onChange, onSearch)}
        </FilterBar.Item>
      ))}
    </FilterBar>
  );
}
