/**
 * @file packages/gen-frame/src/components/NavRenderer/NavRenderer.tsx
 * @description Maps FrameLayoutMode to navigation chrome component (Gate F2).
 * @created 2026-06-29
 *
 * @remark
 * - Exports: NavRenderer, resolveNavLayout
 * - hybrid/rail fall back to leftPanel until implemented
 *
 */

import type { FrameLayoutMode } from '../../types';
import type { NavRendererProps } from '../../types';
import { LeftPanelNav } from '../LeftPanelNav';
import { TitleBarNav } from '../TitleBarNav';

export function resolveNavLayout(layout: FrameLayoutMode): 'leftPanel' | 'titleBar' {
  if (layout === 'titleBar') return 'titleBar';
  return 'leftPanel';
}

export function NavRenderer({
  layout,
  menu,
  activeMenuId,
  onMenuSelect,
  menuTitle,
  menuAriaLabel,
}: NavRendererProps) {
  const resolved = resolveNavLayout(layout);

  if (resolved === 'titleBar') {
    return (
      <TitleBarNav
        items={menu.items}
        activeId={activeMenuId}
        onSelect={onMenuSelect}
        ariaLabel={menuAriaLabel}
      />
    );
  }

  return (
    <LeftPanelNav
      items={menu.items}
      activeId={activeMenuId}
      onSelect={onMenuSelect}
      title={menuTitle}
      ariaLabel={menuAriaLabel}
    />
  );
}
