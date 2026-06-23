/**
 * @file packages/ui/test/setup.ts
 * @description Vitest setup: jest-dom matchers and theme CSS for token variables in jsdom.
 * @created 2026-06-23
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
