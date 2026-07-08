/**
 * @file apps/demo/src/mocks/browser.ts
 * @description MSW browser worker for @gen-office/demo (dev mock backend).
 * @created 2026-07-08
 *
 * @remark
 * - main.tsx에서 isMswEnabled()일 때만 동적 import + start
 *
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
