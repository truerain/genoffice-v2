/**
 * @file packages/ui/src/index.ts
 * @description Public entry barrel exports for @gen-office/ui.
 * @created 2026-06-23
 *
 * @remark
 * - Side-effect: ./index.css (theme tokens)
 * - Export components as each Gate completes (… Drawer, Popover, DropdownMenu, Select, StandardSelect)
 */
import './index.css';

// core step 1 components (leaf components)
export * from './core/button';
export * from './core/label';
export * from './core/separator';
export * from './core/badge';
export * from './core/input';
export * from './core/textarea';

// core step 2 components (form toggles)
export * from './core/checkbox';
export * from './core/switch';
export * from './core/radio';
export * from './core/slider';

// core step 3 components (overlay)
export * from './core/dialog';
export * from './core/drawer';
export * from './core/popover';
export * from './core/dropdown-menu';
export * from './core/select';
