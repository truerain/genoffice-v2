/**
 * @file apps/docs/scripts/extract-ui-modules-css.mjs
 * @description Extract CSS-module rules from @gen-office/ui dist (skip theme reset).
 * @created 2026-07-13
 *
 * @remark
 * - Run after `pnpm -C packages/ui build` when Button/etc. class hashes change.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const input = path.join(root, 'packages/ui/dist/index.css');
const output = path.join(root, 'apps/docs/src/styles/gen-office-ui-modules.css');

const css = fs.readFileSync(input, 'utf8');
const moduleStart = css.search(/\._[A-Za-z0-9]+_/);
if (moduleStart < 0) {
  throw new Error('No CSS-module rules found in ui dist/index.css');
}

const header = `/**
 * @file apps/docs/src/styles/gen-office-ui-modules.css
 * @description UI CSS-module rules only (no theme reset). Generated from @gen-office/ui dist.
 * @created 2026-07-13
 *
 * @remark
 * - Do not import @gen-office/ui/index.css in docs — it re-imports theme reset and collapses Fumadocs padding.
 * - Regenerate: node apps/docs/scripts/extract-ui-modules-css.mjs
 */

`;

fs.writeFileSync(output, header + css.slice(moduleStart), 'utf8');
console.log(`Wrote ${output} (${css.length - moduleStart} bytes of module CSS)`);
