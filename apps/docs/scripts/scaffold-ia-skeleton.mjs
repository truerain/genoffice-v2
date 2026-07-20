/**
 * @file apps/docs/scripts/scaffold-ia-skeleton.mjs
 * @description Scaffold docs sidebar IA folders with placeholder MDX (en/ko).
 * @created 2026-07-13
 *
 * @remark
 * - Idempotent overwrite of stub pages under products, grid-core, grid-advanced, patterns, api, migration.
 * - Does not touch existing Getting Started MDX pages.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content/docs');

function stubEn(title, desc) {
  return `---
title: ${title}
description: ${desc}
---

# ${title}

This page is a **placeholder**. The sidebar structure is fixed; content will be filled in later docs phases.
`;
}

function stubKo(title, desc) {
  return `---
title: ${title}
description: ${desc}
---

# ${title}

이 페이지는 **자리 표시자**입니다. 사이드바 구조만 고정해 두었고, 본문은 이후 Docs Phase에서 채웁니다.
`;
}

const structure = {
  products: {
    title: { en: 'Products', ko: 'Products' },
    pages: [
      ['index', { en: 'Overview', ko: '개요' }],
      ['gen-frame', { en: 'GenFrame / MDI', ko: 'GenFrame / MDI' }],
      ['gen-datagrid', { en: 'GenDataGrid', ko: 'GenDataGrid' }],
      ['gen-datagrid-crud', { en: 'GenDataGridCrud', ko: 'GenDataGridCrud' }],
      ['gen-chart', { en: 'GenChart', ko: 'GenChart' }],
      ['ui-theme', { en: 'UI / Theme', ko: 'UI / Theme' }],
    ],
  },
  'grid-core': {
    title: { en: 'GenDataGrid — Core', ko: 'GenDataGrid — Core' },
    pages: [
      ['index', { en: 'Overview', ko: '개요' }],
      ['columns', { en: 'Columns', ko: 'Columns' }],
      ['rows', { en: 'Rows', ko: 'Rows' }],
      ['cells', { en: 'Cells', ko: 'Cells' }],
      ['filtering', { en: 'Filtering', ko: 'Filtering' }],
      ['selection', { en: 'Selection', ko: 'Selection' }],
      ['editing', { en: 'Editing', ko: 'Editing' }],
      ['clipboard', { en: 'Clipboard', ko: 'Clipboard' }],
      ['virtualization', { en: 'Virtualization', ko: 'Virtualization' }],
      ['layout', { en: 'Layout', ko: 'Layout' }],
    ],
  },
  'grid-advanced': {
    title: { en: 'GenDataGrid — Advanced', ko: 'GenDataGrid — Advanced' },
    pages: [
      ['index', { en: 'Overview', ko: '개요' }],
      ['master-detail', { en: 'Master Detail', ko: 'Master Detail' }],
      ['tree', { en: 'Tree', ko: 'Tree' }],
      ['merge-span', { en: 'Merge / Span', ko: 'Merge / Span' }],
      ['nested-grid', { en: 'Nested Grid', ko: 'Nested Grid' }],
      ['performance', { en: 'Performance', ko: 'Performance' }],
    ],
  },
  patterns: {
    title: { en: 'Patterns', ko: 'Patterns' },
    pages: [
      ['index', { en: 'Overview', ko: '개요' }],
      ['admin-crud', { en: 'Admin CRUD', ko: 'Admin CRUD' }],
      ['filterbar-grid', { en: 'FilterBar + Grid', ko: 'FilterBar + Grid' }],
      ['lookup-modal', { en: 'Lookup Modal', ko: 'Lookup Modal' }],
      ['chart-from-selection', { en: 'Chart from selection', ko: 'Chart from selection' }],
    ],
  },
  api: {
    title: { en: 'API Reference', ko: 'API Reference' },
    pages: [
      ['index', { en: 'Overview', ko: '개요' }],
      ['gen-frame', { en: 'gen-frame', ko: 'gen-frame' }],
      ['gen-datagrid', { en: 'gen-datagrid', ko: 'gen-datagrid' }],
      ['gen-datagrid-crud', { en: 'gen-datagrid-crud', ko: 'gen-datagrid-crud' }],
      ['gen-chart', { en: 'gen-chart', ko: 'gen-chart' }],
      ['ui', { en: 'ui', ko: 'ui' }],
      ['theme', { en: 'theme', ko: 'theme' }],
    ],
  },
  migration: {
    title: { en: 'Migration', ko: 'Migration' },
    pages: [
      ['index', { en: 'Overview', ko: '개요' }],
      ['gen-grid-to-datagrid', { en: 'gen-grid → gen-datagrid', ko: 'gen-grid → gen-datagrid' }],
    ],
  },
};

const desc = {
  en: 'Placeholder — content coming soon',
  ko: '자리 표시자 — 본문 추후 작성',
};

for (const locale of ['en', 'ko']) {
  const localeRoot = path.join(docsRoot, locale);
  const topMeta = {
    title: locale === 'en' ? 'Documentation' : '문서',
    pages: [
      '---Getting Started---',
      'index',
      'quick-start',
      'installation',
      'key-features',
      'first-crud',
      'theme-setup',
      '---Products---',
      'products',
      '---GenDataGrid Core---',
      'grid-core',
      '---GenDataGrid Advanced---',
      'grid-advanced',
      '---Patterns---',
      'patterns',
      '---API Reference---',
      'api',
      '---Migration---',
      'migration',
    ],
  };
  fs.writeFileSync(path.join(localeRoot, 'meta.json'), `${JSON.stringify(topMeta, null, 2)}\n`, 'utf8');

  for (const [folder, def] of Object.entries(structure)) {
    const dir = path.join(localeRoot, folder);
    fs.mkdirSync(dir, { recursive: true });
    const folderMeta = {
      title: def.title[locale],
      pages: def.pages.map(([id]) => id),
    };
    fs.writeFileSync(path.join(dir, 'meta.json'), `${JSON.stringify(folderMeta, null, 2)}\n`, 'utf8');
    for (const [id, titles] of def.pages) {
      const title = titles[locale];
      const body = locale === 'en' ? stubEn(title, desc.en) : stubKo(title, desc.ko);
      fs.writeFileSync(path.join(dir, `${id}.mdx`), body, 'utf8');
    }
  }
}

console.log('Wrote IA skeleton under content/docs/{en,ko}');
