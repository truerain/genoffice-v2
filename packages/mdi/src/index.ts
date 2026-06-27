/**
 * @file packages/mdi/src/index.ts
 * @description Public entry barrel exports for @gen-office/mdi.
 * @created 2026-06-27
 *
 * @remark
 * - Side-effect: ./index.css (theme tokens)
 * - Exports: MDIContainer, TabBar, Tab, TabPanel, useMDIStore, types
 */
import './index.css';

export { MDIContainer, TabBar, Tab, TabPanel } from './components';
export { useMDIStore } from './store/mdiStore';

export type {
  MDITab,
  TabPosition,
  MDIContainerProps,
  TabBarProps,
  TabProps,
  TabPanelProps,
  MDIState,
  MDIActions,
  MDIStore,
} from './types';
