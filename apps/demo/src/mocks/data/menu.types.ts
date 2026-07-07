/**
 * @file apps/demo/src/mocks/data/menu.types.ts
 * @description V1-compatible flat app menu row (ported from frontend mocks).
 * @created 2026-07-07
 *
 * @remark
 * - Source of truth: V1 `apps/demo/src/mocks/data/menu.ts`
 *
 */

export interface V1AppMenu {
  menuId: number;
  menuName: string;
  menuNameEng: string;
  menuDesc?: string;
  menuDescEng?: string;
  menuIcon?: string;
  menuLevel?: number;
  execComponent?: string;
  parentMenuId: number | null;
  displayYn: string;
  useYn?: string;
  sortOrder: number;
}
