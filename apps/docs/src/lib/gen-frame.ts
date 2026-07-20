/**
 * @file apps/docs/src/lib/gen-frame.ts
 * @description Docs-safe gen-frame imports (no theme CSS side-effect from package barrel).
 * @created 2026-07-13
 *
 * @remark
 * - `@gen-office/gen-frame` barrel imports `./index.css` which pulls theme reset.
 * - Docs re-exports component/hook sources so Next compiles CSS modules without reset.
 */

'use client';

export { WorkspaceFrame } from '../../../../packages/gen-frame/src/components/WorkspaceFrame';
export { FrameBrand } from '../../../../packages/gen-frame/src/components/FrameBrand';
export { SinglePageHost } from '../../../../packages/gen-frame/src/components/SinglePageHost';
export { useSingleNavigationController } from '../../../../packages/gen-frame/src/navigation/useSingleNavigationController';

export type {
  FrameMenuItem,
  FrameOpenPagePayload,
} from '../../../../packages/gen-frame/src/types';
