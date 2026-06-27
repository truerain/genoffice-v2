/**
 * @file packages/mdi/test/store/MDIStoreProvider.test.tsx
 * @description MDIStoreProvider isolates store per subtree.
 * @created 2026-06-27
 */
import { useLayoutEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MDIContainer } from '../../src/components/MDIContainer/MDIContainer';
import { MDIStoreProvider } from '../../src/store/MDIStoreProvider';
import { useMDIStore } from '../../src/store/mdiStore';

function TabCountLabel({ label }: { label: string }) {
  const count = useMDIStore((state) => state.tabs.length);
  return <span>{label}:{count}</span>;
}

function SeedTabs({ ids }: { ids: string[] }) {
  const addTab = useMDIStore((state) => state.addTab);

  useLayoutEffect(() => {
    ids.forEach((id) => {
      addTab({ id, title: id, content: null });
    });
  }, [addTab, ids]);

  return null;
}

describe('MDIStoreProvider', () => {
  it('isolates tab state between provider instances', () => {
    render(
      <>
        <MDIStoreProvider>
          <SeedTabs ids={['a', 'b']} />
          <TabCountLabel label="left" />
        </MDIStoreProvider>
        <MDIStoreProvider>
          <TabCountLabel label="right" />
        </MDIStoreProvider>
      </>,
    );

    expect(screen.getByText('left:2')).toBeInTheDocument();
    expect(screen.getByText('right:0')).toBeInTheDocument();
  });

  it('scopes MDIContainer to provider store', () => {
    render(
      <MDIStoreProvider>
        <SeedTabs ids={['only']} />
        <MDIContainer />
      </MDIStoreProvider>,
    );

    expect(screen.getByRole('tab', { name: /only/i })).toBeInTheDocument();
  });
});
