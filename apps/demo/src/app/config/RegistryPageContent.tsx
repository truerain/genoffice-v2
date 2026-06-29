/**
 * @file apps/demo/src/app/config/RegistryPageContent.tsx
 * @description Renders registry lazy page inside Suspense (Gate D2).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: RegistryPageContent
 *
 */

import { Suspense } from 'react';
import { componentRegistry } from './componentRegistry.dynamic';
import type { ComponentName } from './componentRegistry.types';
import { useI18n } from '../../i18n';
import styles from './RegistryPageContent.module.css';

export interface RegistryPageContentProps {
  componentName: ComponentName;
  params?: Record<string, string>;
}

function PageFallback() {
  const { t } = useI18n();
  return <div className={styles.fallback}>{t('common.loading')}</div>;
}

export function RegistryPageContent({ componentName, params }: RegistryPageContentProps) {
  const Component = componentRegistry[componentName];

  return (
    <Suspense fallback={<PageFallback />}>
      <Component {...params} />
    </Suspense>
  );
}
