/**
 * @file apps/demo/src/mocks/handlers/index.ts
 * @description Combined MSW request handlers for @gen-office/demo.
 * @created 2026-07-08
 *
 * @remark
 * - auth + app-menu + admin users
 *
 */

import { HttpHandler } from 'msw';
import { appMenuHandlers } from './appMenuHandlers';
import { authHandlers } from './authHandlers';
import { userHandlers } from './userHandlers';
import { commonHandlers } from './commonHandlers';
import { orgHandlers } from './orgHandlers';

export const handlers: HttpHandler[] = 
[
    ...authHandlers, 
    ...appMenuHandlers, 
    ...userHandlers,
    ...commonHandlers,
    ...orgHandlers,
];
