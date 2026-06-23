/**
 * @file packages/utils/src/index.ts
 * @description Public entry barrel exports for @gen-office/utils.
 * @created 2026-06-23
 *
 * @remark
 * - Modules: cn, format, normalize, validation
 * - V1 compat: format/date.v1, normalize/normalize.v1
 * - Consumers should import from @gen-office/utils only (no deep imports)
 */
export * from './cn';
export * from './format';
export * from './normalize';
export * from './normalize/normalize.v1';
export * from './validation';
