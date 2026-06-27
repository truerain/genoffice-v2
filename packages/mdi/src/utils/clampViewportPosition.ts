/**
 * @file packages/mdi/src/utils/clampViewportPosition.ts
 * @description Clamps fixed overlay coordinates to the viewport.
 * @created 2026-06-27
 */
export function clampViewportPosition(
  anchor: { x: number; y: number },
  size: { width: number; height: number },
  padding = 8,
): { left: number; top: number } {
  const maxLeft = Math.max(padding, window.innerWidth - size.width - padding);
  const maxTop = Math.max(padding, window.innerHeight - size.height - padding);

  return {
    left: Math.min(Math.max(anchor.x, padding), maxLeft),
    top: Math.min(Math.max(anchor.y, padding), maxTop),
  };
}
