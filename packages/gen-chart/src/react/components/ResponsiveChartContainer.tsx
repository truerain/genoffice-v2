/**
 * @file packages/gen-chart/src/react/components/ResponsiveChartContainer.tsx
 * @description ResizeObserver-based responsive sizing wrapper for charts.
 * @created 2026-06-27
 *
 * @remark
 * - ResizeObserver + initial getBoundingClientRect; omits render until ready when size > 0
 * - Gate C7 — dashboard cards should set flex: 1, minHeight: 0 on this wrapper
 */

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { resolveResponsiveSize } from '../layout/resolveResponsiveSize';

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
      const measured = resolveResponsiveSize({
        width: baseWidth,
        height: baseHeight,
        minWidth,
        minHeight,
        aspectRatio,
      });
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
