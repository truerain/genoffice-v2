/**
 * @file packages/gen-frame/src/components/WorkspaceFrame/WorkspaceFrame.tsx
 * @description Root app workspace — layout chrome and workarea slot (Gate F1).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: WorkspaceFrame
 * - F1: layout leftPanel only; titleBar/hybrid/rail fall back to leftPanel
 *
 */

import { clsx } from 'clsx';
import type { WorkspaceFrameProps } from '../../types';
import { LeftPanelNav } from '../LeftPanelNav';
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
  const showLeftNav =
    layout === 'leftPanel' || layout === 'hybrid' || layout === 'rail';

  return (
    <div
      className={clsx(styles.frame, className)}
      data-gen-frame-root=""
      data-gen-frame-layout={layout}
    >
      {header || headerActions ? (
        <header className={styles.header}>
          {header ? <div className={styles.headerMain}>{header}</div> : <div />}
          {headerActions ? <div className={styles.headerActions}>{headerActions}</div> : null}
        </header>
      ) : null}

      <div className={styles.body}>
        {showLeftNav && menu ? (
          <LeftPanelNav
            items={menu.items}
            activeId={activeMenuId}
            onSelect={onMenuSelect}
            title={menuTitle}
            ariaLabel={menuAriaLabel}
          />
        ) : null}

        <main className={styles.workarea} data-gen-frame-workarea="">
          {workarea}
        </main>
      </div>
    </div>
  );
}
