/**
 * @file packages/ui/src/composed/filterBar/FilterBarCollapseToggle.tsx
 * @description Chevron toggle for FilterBar simple/detail collapse.
 * @created 2026-06-25
 */
import { ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../../core/button';
import styles from './FilterBar.module.css';

export type FilterBarCollapseToggleProps = {
  expanded: boolean;
  onToggle: () => void;
  expandLabel: string;
  collapseLabel: string;
  /** Pill on bottom border vs compact icon in actions column */
  variant?: 'pill' | 'icon';
  className?: string;
};

export function FilterBarCollapseToggle({
  expanded,
  onToggle,
  expandLabel,
  collapseLabel,
  variant = 'pill',
  className,
}: FilterBarCollapseToggleProps) {
  const ariaLabel = expanded ? collapseLabel : expandLabel;

  return (
    <Button
      type="button"
      variant={variant === 'icon' ? 'ghost' : 'outline'}
      size="sm"
      className={clsx(
        styles.collapseToggleButton,
        variant === 'pill' ? styles.collapseTogglePill : styles.collapseToggleIcon,
        className
      )}
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {expanded ? <ChevronUp size={14} aria-hidden /> : <ChevronDown size={14} aria-hidden />}
    </Button>
  );
}
