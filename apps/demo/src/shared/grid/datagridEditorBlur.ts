/**
 * @file apps/demo/src/shared/grid/datagridEditorBlur.ts
 * @description Portal editor blur guard (mirrors gen-datagrid blurPolicy contract).
 * @created 2026-07-09
 *
 * @remark
 * - Popup lookup editor용. 패키지 export 전 demo 로컬 복제.
 */

import type * as React from 'react';
import type { GenDataGridEditBlurOwnership } from '@gen-office/gen-datagrid';

const EDITOR_SURFACE_ATTR = 'data-gen-datagrid-editor-surface';

function isInsideEditorSurface(
  node: Node | null | undefined,
  options: {
    gridRoot: HTMLElement | null;
    editorSurfaces: Iterable<HTMLElement>;
  },
): boolean {
  if (!node) return false;

  const element =
    node instanceof HTMLElement
      ? node
      : node.parentElement instanceof HTMLElement
        ? node.parentElement
        : null;
  if (!element) return false;

  const markedSurface = element.closest(
    `[${EDITOR_SURFACE_ATTR}="true"]`,
  ) as HTMLElement | null;
  if (markedSurface) {
    if (options.gridRoot?.contains(markedSurface)) return true;
    for (const registeredSurface of options.editorSurfaces) {
      if (registeredSurface === markedSurface || registeredSurface.contains(markedSurface)) {
        return true;
      }
    }
  }

  for (const registeredSurface of options.editorSurfaces) {
    if (registeredSurface.contains(element)) return true;
  }

  return false;
}

export function createEditorBlurHandler({
  blurOwnership,
  commitOnBlur,
  gridRoot,
  getEditorSurfaces,
  commit,
}: {
  blurOwnership: GenDataGridEditBlurOwnership;
  commitOnBlur?: boolean;
  gridRoot: HTMLElement | null;
  getEditorSurfaces: () => Iterable<HTMLElement>;
  commit: () => void;
}) {
  return (event: React.FocusEvent<HTMLElement>) => {
    if (blurOwnership === 'modal') {
      return;
    }

    if (
      isInsideEditorSurface(event.relatedTarget, {
        gridRoot,
        editorSurfaces: getEditorSurfaces(),
      })
    ) {
      return;
    }

    if (!commitOnBlur) return;
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;

    commit();
  };
}
