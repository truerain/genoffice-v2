/**
 * @file packages/gen-datagrid/test/setup.ts
 * @description Vitest setup: jest-dom, package CSS, ResizeObserver mock.
 * @created 2026-06-29
 */

import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '../src/index.css';

afterEach(() => {
  cleanup();
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;
