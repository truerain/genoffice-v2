/**
 * @file apps/docs/src/components/mdx.tsx
 * @description MDX component map including live GenOffice examples.
 * @created 2026-07-13
 */

import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { CrudGrid } from '@/examples/CrudGrid';
import { EditableGrid } from '@/examples/EditableGrid';
import { QuickStartApp } from '@/examples/QuickStartApp';
import { QuickStartGrid } from '@/examples/QuickStartGrid';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    QuickStartApp,
    QuickStartGrid,
    EditableGrid,
    CrudGrid,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
