/**
 * @file packages/ui/src/composed/datePicker/CalendarTrigger.tsx
 * @description Icon button for opening date picker popovers from Input suffix slot.
 * @created 2026-06-25
 */
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './DatePicker.module.css';

type CalendarTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  'aria-label': string;
};

export const CalendarTrigger = forwardRef<HTMLButtonElement, CalendarTriggerProps>(
  ({ className, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={clsx(styles.calendarTrigger, className)} {...props}>
      <CalendarIcon className={styles.calendarTriggerIcon} aria-hidden />
    </button>
  )
);

CalendarTrigger.displayName = 'CalendarTrigger';
