/**
 * @file packages/gen-frame/src/components/WorkspaceFrame/WorkspaceFrame.matrix.stories.tsx
 * @description Layout matrix showcase — switch leftPanel / titleBar (Gate F2).
 * @created 2026-06-29
 *
 * @remark
 * - title: GenFrame/Layout/Matrix
 *
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { WorkspaceFrame } from './WorkspaceFrame';
import { FrameLayoutToggle } from '../FrameLayoutToggle';
import { useFrameLayout } from '../../hooks/useFrameLayout';
import { MOCK_FRAME_MENU_ITEMS } from '../../stories/mockMenu';
import { frameStyle, findMenuItem, workareaPanelStyle } from '../../stories/frameStoryUtils';
import type { FrameMenuItem, FrameLayoutMode } from '../../types';

const meta: Meta<typeof WorkspaceFrame> = {
  title: 'GenFrame/Layout/Matrix',
  component: WorkspaceFrame,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Framework showcase: same menu and workarea with `leftPanel` or `titleBar` layout. Layout choice persists via `useFrameLayout`.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

function LayoutMatrixDemo({ initialLayout = 'leftPanel' }: { initialLayout?: FrameLayoutMode }) {
  const { layout, setLayout } = useFrameLayout(initialLayout);
  const [activeId, setActiveId] = useState('home');

  const handleSelect = (item: FrameMenuItem) => {
    setActiveId(item.id);
  };

  const active = findMenuItem(activeId);

  return (
    <div style={frameStyle}>
      <WorkspaceFrame
        layout={layout}
        header={<span style={{ fontWeight: 600, flexShrink: 0 }}>GenOffice Frame</span>}
        headerActions={
          <>
            <FrameLayoutToggle value={layout} onChange={setLayout} />
            <span style={{ fontSize: 13, color: 'var(--color-fg-secondary)' }}>demo user</span>
          </>
        }
        menu={{ items: MOCK_FRAME_MENU_ITEMS }}
        menuTitle="Menu"
        menuAriaLabel="Main navigation"
        activeMenuId={activeId}
        onMenuSelect={handleSelect}
        workarea={
          <div style={workareaPanelStyle}>
            <div style={{ textAlign: 'center' }}>
              <div>
                Layout: <strong>{layout}</strong>
              </div>
              <div style={{ marginTop: 8 }}>
                Active: <strong>{active?.label ?? activeId}</strong>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <LayoutMatrixDemo />,
};

export const TitleBarDefault: Story = {
  render: () => <LayoutMatrixDemo initialLayout="titleBar" />,
};
