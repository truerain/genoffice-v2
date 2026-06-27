/**
 * @file packages/gen-chart/test/setup.ts
 * @description Vitest setup for @gen-office/gen-chart.
 * @created 2026-06-27
 *
 * @remark
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '../src/index.css';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

afterEach(() => {
  cleanup();
});
