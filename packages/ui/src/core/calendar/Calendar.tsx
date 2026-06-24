/**
 * @file packages/ui/src/core/calendar/Calendar.tsx
 * @description Themed DayPicker wrapper for GenOffice V2 (@daypicker/react v10).
 * @created 2026-06-24
 */
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from '@daypicker/react';
import { clsx } from 'clsx';
import type { CalendarProps } from './Calendar.types';
import { format } from 'date-fns';

import '@daypicker/react/style.css';
import styles from './Calendar.module.css';

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      formatters={{
        formatCaption: (month, options) =>
          format(month, 'yyyy.M', { locale: options?.locale }),
      }}
      className={clsx(styles.calendar, className)}
      classNames={{
        month: styles.month,
        month_caption: styles.caption,
        caption_label: styles.captionLabel,
        month_grid: styles.table,
        weekdays: styles.headRow,
        weekday: styles.headCell,
        week: styles.row,
        day: styles.cell,
        day_button: styles.day,
        selected: styles.daySelected,
        today: styles.dayToday,
        outside: styles.dayOutside,
        disabled: styles.dayDisabled,
        range_middle: styles.dayRangeMiddle,
        range_start: styles.dayRangeStart,
        range_end: styles.dayRangeEnd,
        hidden: styles.dayHidden,
        ...classNames,
      }}
      components={{
        Chevron: ({ className: iconClassName, orientation, size }) => {
          const iconProps = {
            className: clsx(styles.icon, iconClassName),
            size,
          };
          if (orientation === 'left') return <ChevronLeft {...iconProps} />;
          if (orientation === 'right') return <ChevronRight {...iconProps} />;
          if (orientation === 'up') {
            return <ChevronLeft {...iconProps} style={{ transform: 'rotate(90deg)' }} />;
          }
          return <ChevronRight {...iconProps} style={{ transform: 'rotate(90deg)' }} />;
        },
      }}
      {...props}
    />
  );
}
