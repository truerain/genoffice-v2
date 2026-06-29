/**
 * @file packages/gen-frame/src/navigation/navigationShowcase.stories.tsx
 * @description Navigation mode showcase — single vs MDI (Gate F5).
 * @created 2026-06-29
 *
 * @remark
 * - title: GenFrame/Navigation/Single
 *
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useMemo, useState } from 'react';
import { WorkspaceFrame } from '../components/WorkspaceFrame';
import { FrameBrand } from '../components/FrameBrand';
import { MdiPageHost } from '../components/MdiPageHost';
import { SinglePageHost } from '../components/SinglePageHost';
import { useMdiNavigationController } from './useMdiNavigationController';
import { useSingleNavigationController } from './useSingleNavigationController';
import { MOCK_FRAME_MENU_ITEMS } from '../stories/mockMenu';
import { frameStyle, workareaPanelStyle } from '../stories/frameStoryUtils';
import type { FrameMenuItem, FrameOpenPagePayload } from '../types';

const meta: Meta = {
  title: 'GenFrame/Navigation/Single',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Single-page navigation: one active page in the workarea. Compare with MDI mode using the same menu.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

function resolveStoryContent(payload: FrameOpenPagePayload) {
  return {
    content: (
      <div style={workareaPanelStyle}>
        <div style={{ textAlign: 'center' }}>
          <div>
            Page: <strong>{payload.title}</strong>
          </div>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            pageId: <code>{payload.pageId}</code>
          </div>
        </div>
      </div>
    ),
  };
}

function menuPayload(item: FrameMenuItem): FrameOpenPagePayload {
  return {
    pageId: item.id,
    title: item.label,
  };
}

function SingleNavigationDemo() {
  const { controller, currentPage } = useSingleNavigationController({
    resolvePage: resolveStoryContent,
  });
  const activeId = currentPage?.pageId;

  const handleSelect = useCallback(
    (item: FrameMenuItem) => {
      controller.open(menuPayload(item));
    },
    [controller],
  );

  return (
    <div style={frameStyle}>
      <WorkspaceFrame
        layout="leftPanel"
        header={<FrameBrand alt="Single navigation" />}
        menu={{ items: MOCK_FRAME_MENU_ITEMS }}
        menuTitle="Menu"
        menuAriaLabel="Main navigation"
        activeMenuId={activeId}
        onMenuSelect={handleSelect}
        workarea={
          <SinglePageHost
            page={currentPage}
            emptyContent={<span>Select a menu item</span>}
          />
        }
      />
    </div>
  );
}

type NavigationMode = 'single' | 'mdi';

function MdiNavigationDemo() {
  const { controller } = useMdiNavigationController({
    resolveTab: (payload) => {
      const resolved = resolveStoryContent(payload);
      return {
        id: payload.pageId,
        title: payload.title,
        content: resolved.content,
      };
    },
  });

  const [activeId, setActiveId] = useState<string | undefined>('home');

  const handleSelect = useCallback(
    (item: FrameMenuItem) => {
      controller.open(menuPayload(item));
      setActiveId(item.id);
    },
    [controller],
  );

  return (
    <div style={frameStyle}>
      <WorkspaceFrame
        layout="leftPanel"
        header={<FrameBrand alt="MDI navigation" />}
        menu={{ items: MOCK_FRAME_MENU_ITEMS }}
        menuTitle="Menu"
        menuAriaLabel="Main navigation"
        activeMenuId={activeId}
        onMenuSelect={handleSelect}
        workarea={
          <MdiPageHost
            emptyContent={<span>Open a page from the menu</span>}
            tabBarLabels={{ close: 'Close', closeOthers: 'Close others', closeAll: 'Close all' }}
          />
        }
      />
    </div>
  );
}

function MdiVsSingleDemo() {
  const [mode, setMode] = useState<NavigationMode>('single');

  const label = useMemo(
    () => (mode === 'single' ? 'Single (one page)' : 'MDI (tabs)'),
    [mode],
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--color-fg-secondary)' }}>Navigation:</span>
        <button type="button" onClick={() => setMode('single')} disabled={mode === 'single'}>
          Single
        </button>
        <button type="button" onClick={() => setMode('mdi')} disabled={mode === 'mdi'}>
          MDI
        </button>
        <span style={{ fontSize: 13 }}>{label}</span>
      </div>
      {mode === 'single' ? <SingleNavigationDemo /> : <MdiNavigationDemo />}
    </div>
  );
}

export const SinglePage: Story = {
  render: () => <SingleNavigationDemo />,
};

export const MdiVsSingle: Story = {
  render: () => <MdiVsSingleDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Same menu model with `SinglePageHost` or `MdiPageHost`.',
      },
    },
  },
};
