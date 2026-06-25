/**
 * @file packages/ui/src/composed/filterBar/SearchInput.tsx
 * @description Internal search-styled Input for StandardFilterBar (not public export).
 * @created 2026-06-25
 *
 * @remark
 * - Used when FilterField type is search
 * - Not re-exported from package index
 */
import { clsx } from 'clsx';
import { Search } from 'lucide-react';
import { Input } from '../../core/input';
import styles from './SearchInput.module.css';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
  clearLabel?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search..',
  className,
  clearable = true,
  clearLabel,
}: SearchInputProps) {
  return (
    <div className={clsx(styles.searchWrapper, className)}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        prefixContent={<Search size={16} className={styles.searchIcon} aria-hidden />}
        fullWidth
        clearable={clearable}
        clearLabel={clearLabel}
      />
    </div>
  );
}
