/**
 * @file packages/utils/src/normalize/normalize.v1.ts
 * @description V1 @gen-office/utils normalize API compatibility aliases.
 * @created 2026-06-23
 *
 * @remark
 * - Exports: normalizeUseYn (= normalizeYesNo)
 * - Remove after ui/V1 consumer migration
 */

/** @deprecated Use `normalizeYesNo` from `./index` */
export { normalizeYesNo as normalizeUseYn } from './index';
