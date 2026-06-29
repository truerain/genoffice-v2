/**
 * @file packages/gen-frame/test/setup.ts
 * @description Vitest setup for @gen-office/gen-frame.
 * @created 2026-06-29
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import '../src/index.css';

afterEach(() => {
  cleanup();
});
