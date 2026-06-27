/**
 * @file packages/mdi/test/setup.ts
 * @description Vitest setup: jest-dom, theme CSS, store reset, ResizeObserver mock.
 * @created 2026-06-27
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';
import { useMDIStore } from '../src/store/mdiStore';
import '../src/index.css';

beforeEach(() => {
  useMDIStore.getState().reset();
});

afterEach(() => {
  cleanup();
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;
