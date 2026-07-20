'use client';

/**
 * @file apps/docs/src/examples/QuickStartApp.tsx
 * @description Live GenFrame shell + first page grid for Quick Start.
 * @created 2026-07-13
 *
 * @remark
 * - Single-page navigation (MDI is a follow-up).
 * - Imports gen-frame via `@/lib/gen-frame` to avoid theme reset CSS.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { GenDataGrid } from '@gen-office/gen-datagrid';
import type { ColumnDef } from '@tanstack/react-table';
import { DocsExample } from '@/components/DocsExample';
import {
  FrameBrand,
  SinglePageHost,
  WorkspaceFrame,
  useSingleNavigationController,
  type FrameMenuItem,
  type FrameOpenPagePayload,
} from '@/lib/gen-frame';

type Car = {
  id: string;
  make: string;
  model: string;
  price: number;
  electric: boolean;
};

const rowData: Car[] = [
  { id: '1', make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { id: '2', make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { id: '3', make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
];

const columns: ColumnDef<Car, unknown>[] = [
  { accessorKey: 'make', header: 'Make', size: 120 },
  { accessorKey: 'model', header: 'Model', size: 140 },
  { accessorKey: 'price', header: 'Price', size: 100 },
  { accessorKey: 'electric', header: 'Electric', size: 100 },
];

const MENU_ITEMS: FrameMenuItem[] = [
  { id: 'cars', label: 'Cars' },
  { id: 'about', label: 'About' },
];

function CarsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: 12 }}>
      <GenDataGrid<Car>
        data={rowData}
        columns={columns}
        getRowId={(row) => row.id}
        gridId="docs-quick-start-app"
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{ padding: 16, fontSize: 14, lineHeight: 1.5 }}>
      First page host — swap this for your admin screens.
    </div>
  );
}

function resolvePage(payload: FrameOpenPagePayload) {
  if (payload.pageId === 'about') {
    return { content: <AboutPage /> };
  }
  return { content: <CarsPage /> };
}

function menuPayload(item: FrameMenuItem): FrameOpenPagePayload {
  return { pageId: item.id, title: item.label };
}

function QuickStartAppInner() {
  const resolve = useCallback(resolvePage, []);
  const { controller, currentPage } = useSingleNavigationController({
    resolvePage: resolve,
  });

  const handleSelect = useCallback(
    (item: FrameMenuItem) => {
      if (item.children?.length) return;
      controller.open(menuPayload(item));
    },
    [controller],
  );

  const menu = useMemo(() => ({ items: MENU_ITEMS }), []);

  useEffect(() => {
    controller.open({ pageId: 'cars', title: 'Cars' });
  }, [controller]);

  return (
    <div style={{ height: 360, width: '100%' }}>
      <WorkspaceFrame
        layout="leftPanel"
        header={<FrameBrand alt="GenOffice">GenOffice</FrameBrand>}
        menu={menu}
        menuTitle="Menu"
        menuAriaLabel="Main navigation"
        activeMenuId={currentPage?.pageId}
        onMenuSelect={handleSelect}
        workarea={
          <SinglePageHost
            page={currentPage}
            emptyContent={<span style={{ fontSize: 14 }}>Select Cars to open the first page</span>}
          />
        }
      />
    </div>
  );
}

export function QuickStartApp() {
  return (
    <DocsExample>
      <QuickStartAppInner />
    </DocsExample>
  );
}
