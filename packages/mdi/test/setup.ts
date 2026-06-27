/**
 * @file packages/mdi/test/setup.ts
 * @description Vitest setup: jest-dom matchers and ResizeObserver mock for jsdom.
 * @created 2026-06-27
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;
