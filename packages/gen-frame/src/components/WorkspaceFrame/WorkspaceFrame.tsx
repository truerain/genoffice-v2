/**
 * @file packages/gen-frame/src/components/WorkspaceFrame/WorkspaceFrame.tsx
 * @description Root app workspace — layout chrome and workarea slot.
 * @created 2026-06-29
 * @updated 2026-06-29
 *
 * @remark
 * - Exports: WorkspaceFrame
 * - F2: leftPanel | titleBar via NavRenderer
 *
 * @history
 * - 2026-06-29 F2: titleBar nav in header row
 * - 2026-06-29 F1: leftPanel layout
 */

import { clsx } from 'clsx';
import type { WorkspaceFrameProps } from '../../types';
import { NavRenderer, resolveNavLayout } from '../NavRenderer';
import styles from './WorkspaceFrame.module.css';

export function WorkspaceFrame({
  layout = 'leftPanel',
  header,
  headerActions,
  menu,
  menuTitle,
  menuAriaLabel,
  activeMenuId,
  onMenuSelect,
  workarea,
  className,
}: WorkspaceFrameProps) {
  const resolvedLayout = resolveNavLayout(layout);
  const isTitleBar = resolvedLayout === 'titleBar';
  const showSideNav = !isTitleBar && menu;
  const showHeader = header || headerActions || (isTitleBar && menu);

  return (
    <div
      className={clsx(styles.frame, className)}
      data-gen-frame-root=""
      data-gen-frame-layout={layout}
    >
      {showHeader ? (
        <header className={clsx(styles.header, isTitleBar && styles.headerTitleBar)}>
          <div className={clsx(styles.headerMain, isTitleBar && styles.headerMainTitleBar)}>
            {header}
            {isTitleBar && menu ? (
              <NavRenderer
                layout={layout}
                menu={menu}
                activeMenuId={activeMenuId}
                onMenuSelect={onMenuSelect}
                menuAriaLabel={menuAriaLabel}
              />
            ) : null}
          </div>
          {headerActions ? <div className={styles.headerActions}>{headerActions}</div> : null}
        </header>
      ) : null}

      <div className={styles.body}>
        {showSideNav ? (
          <NavRenderer
            layout={layout}
            menu={menu}
            activeMenuId={activeMenuId}
            onMenuSelect={onMenuSelect}
            menuTitle={menuTitle}
            menuAriaLabel={menuAriaLabel}
          />
        ) : null}

        <main className={styles.workarea} data-gen-frame-workarea="">
          {workarea}
        </main>
      </div>
    </div>
  );
}
