/**
 * @file packages/gen-chart/src/react/components/ResponsiveChartContainer.tsx
 * @description ResizeObserver-based responsive sizing wrapper for charts.
 * @created 2026-06-27
 *
 * @remark
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export interface ResponsiveChartSize {
  width: number;
  height: number;
  ready: boolean;
}

export interface ResponsiveChartContainerProps {
  children: (size: ResponsiveChartSize) => ReactNode;
  className?: string;
  style?: CSSProperties;
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number;
  fallbackWidth?: number;
  fallbackHeight?: number;
}

function nextSize(
  width: number,
  height: number,
  minWidth: number,
  minHeight: number,
  aspectRatio?: number,
) {
  const safeWidth = Math.max(minWidth, Math.floor(width));
  let safeHeight = Math.max(minHeight, Math.floor(height));

  if (typeof aspectRatio === 'number' && Number.isFinite(aspectRatio) && aspectRatio > 0) {
    safeHeight = Math.max(minHeight, Math.floor(safeWidth / aspectRatio));
  }

  return { width: safeWidth, height: safeHeight };
}

export function ResponsiveChartContainer({
  children,
  className,
  style,
  minWidth = 120,
  minHeight = 120,
  aspectRatio,
  fallbackWidth = 320,
  fallbackHeight = 220,
}: ResponsiveChartContainerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<ResponsiveChartSize>(() => ({
    width: Math.max(minWidth, fallbackWidth),
    height: Math.max(minHeight, fallbackHeight),
    ready: false,
  }));

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const update = (rawWidth: number, rawHeight: number, ready: boolean) => {
      const baseWidth = rawWidth > 0 ? rawWidth : fallbackWidth;
      const baseHeight = rawHeight > 0 ? rawHeight : fallbackHeight;
      const measured = nextSize(baseWidth, baseHeight, minWidth, minHeight, aspectRatio);
      setSize((prev) => {
        if (
          prev.width === measured.width &&
          prev.height === measured.height &&
          prev.ready === ready
        ) {
          return prev;
        }
        return { ...measured, ready };
      });
    };

    const rect = element.getBoundingClientRect();
    update(rect.width, rect.height, rect.width > 0 && rect.height > 0);

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      update(width, height, width > 0 && height > 0);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [aspectRatio, fallbackHeight, fallbackWidth, minHeight, minWidth]);

  return (
    <div
      ref={rootRef}
      className={className}
      data-gen-chart-responsive=""
      style={{ width: '100%', height: '100%', minWidth: 0, minHeight: 0, ...style }}
    >
      {children(size)}
    </div>
  );
}
