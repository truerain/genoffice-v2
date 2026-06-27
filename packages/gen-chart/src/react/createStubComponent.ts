/**
 * @file packages/gen-chart/src/react/createStubComponent.ts
 * @description Factory for Gate C0 placeholder chart components.
 * @created 2026-06-27
 *
 * @remark
 */

import type { ComponentType } from 'react';

export function createStubComponent(displayName: string): ComponentType<Record<string, never>> {
  function StubComponent() {
    return null;
  }
  StubComponent.displayName = displayName;
  return StubComponent;
}
