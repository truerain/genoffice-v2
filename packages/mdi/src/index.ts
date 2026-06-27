/**
 * @file packages/mdi/src/index.ts
 * @description Public entry barrel exports for @gen-office/mdi.
 * @created 2026-06-27
 *
 * @remark
 * - Side-effect: ./index.css (theme tokens)
 * - Exports: MDIContainer, TabBar, Tab, TabPanel, useMDIStore, MDIStoreProvider, createMDIStore, types
 */
import './index.css';

export { MDIContainer, TabBar, Tab, TabPanel } from './components';
export { useMDIStore, createMDIStore } from './store/mdiStore';
export { MDIStoreProvider } from './store/MDIStoreProvider';

export type {
  MDITab,
  TabPosition,
  MDIContainerProps,
  TabBarProps,
  TabBarLabels,
  TabProps,
  TabPanelProps,
  MDIState,
  MDIActions,
  MDIStore,
} from './types';

export { DEFAULT_TAB_BAR_LABELS } from './types';
