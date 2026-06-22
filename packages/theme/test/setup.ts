/**
 * @file packages/theme/test/setup.ts
 * @description Vitest setup: load package CSS so token variables resolve in jsdom.
 * @created 2026-06-22
 */
import '@testing-library/jest-dom/vitest';
import '../src/index.css';
