/**
 * @file packages/ui/src/index.ts
 * @description Public entry barrel exports for @gen-office/ui.
 * @created 2026-06-23
 *
 * @remark
 * - Side-effect: ./index.css (theme tokens)
 * - Export components as each Gate completes (Button, Label, Separator, Badge, Input, Textarea, …)
 */
import './index.css';

export * from './core/button';
export * from './core/label';
export * from './core/separator';
export * from './core/badge';
export * from './core/input';
export * from './core/textarea';
