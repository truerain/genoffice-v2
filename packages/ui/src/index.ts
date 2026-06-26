/**
 * @file packages/ui/src/index.ts
 * @description Public entry barrel exports for @gen-office/ui.
 * @created 2026-06-23
 *
 * @remark
 * - Side-effect: ./index.css (theme tokens)
 * - Export components as each Gate completes (… Wave 5 C4: filterBar)
 */
import './index.css';

// core step 1 components (leaf components)
export * from './core/button';
export * from './core/label';
export * from './core/separator';
export * from './core/badge';
export * from './core/input';
export * from './core/maskedInput';
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

// core step 4 components (navigation)
export * from './core/breadcrumb';
export * from './core/calendar';
export * from './core/tabs';
export * from './core/tree';

// core step 5 components (feedback — Radix extensions)
export * from './core/tooltip';
export * from './core/toast';
export * from './core/progress';

export * from './composed/alertDialog';
export * from './composed/confirmDialog';
export * from './composed/splitLayout';
export * from './composed/filterBar';
export * from './composed/datePicker';
export * from './composed/comboBox';