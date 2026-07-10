// packages/gen-datagrid/src/features/master-detail/detailChevronToggle.tsx
// Provides a chevron-style master-detail expand toggle renderer.
//
// @remark
// Use with `renderDetailToggle` or CRUD `masterDetail.toggle.render`. Requires `data-gen-datagrid-detail-toggle`.

import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';

import type {
  GenDataGridDetailToggleContext,
  GenDataGridDetailToggleProps,
} from '../../GenDataGrid.types';

type DetailChevronToggleProps<TData> = {
  ctx: GenDataGridDetailToggleContext<TData>;
  detailToggleProps?: GenDataGridDetailToggleProps;
};

function stopGridActivation(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  event.stopPropagation();
}

export function DetailChevronToggle<TData>({
  ctx,
  detailToggleProps,
}: DetailChevronToggleProps<TData>) {
  const className = clsx(
    'gen-datagrid__detail-toggle',
    'gen-datagrid__detail-toggle--chevron',
    ctx.expanded && 'gen-datagrid__detail-toggle--expanded',
    detailToggleProps?.className
  );

  return (
    <button
      type="button"
      className={className}
      data-gen-datagrid-detail-toggle="true"
      aria-expanded={ctx.expanded}
      aria-label={
        ctx.expanded
          ? detailToggleProps?.ariaLabelCollapse ?? `Collapse row ${ctx.rowId} detail`
          : detailToggleProps?.ariaLabelExpand ?? `Expand row ${ctx.rowId} detail`
      }
      disabled={!ctx.canExpand}
      onMouseDown={stopGridActivation}
      onClick={(event) => {
        stopGridActivation(event);
        ctx.toggle();
      }}
    >
      <ChevronRight className="gen-datagrid__detail-toggle-icon" aria-hidden />
    </button>
  );
}

export function renderDetailChevronToggle<TData>(
  ctx: GenDataGridDetailToggleContext<TData>,
  detailToggleProps?: GenDataGridDetailToggleProps
) {
  return <DetailChevronToggle ctx={ctx} detailToggleProps={detailToggleProps} />;
}
