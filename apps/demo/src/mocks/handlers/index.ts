/**
 * @file apps/demo/src/mocks/handlers/index.ts
 * @description Combined MSW request handlers for @gen-office/demo.
 * @created 2026-07-08
 *
 * @remark
 * - auth + app-menu + admin users
 *
 */

import { appMenuHandlers } from './appMenuHandlers';
import { authHandlers } from './authHandlers';
import { userHandlers } from './userHandlers';

export const handlers = [...authHandlers, ...appMenuHandlers, ...userHandlers];
