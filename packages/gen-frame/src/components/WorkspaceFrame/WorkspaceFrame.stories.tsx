/**
 * @file packages/gen-frame/src/components/WorkspaceFrame/WorkspaceFrame.stories.tsx
 * @description Storybook stories for WorkspaceFrame leftPanel layout (Gate F1).
 * @created 2026-06-29
 *
 * @remark
 * - title: GenFrame/Layout/LeftPanel
 * - Parent frame: explicit height + flex min-height 0
 *
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { WorkspaceFrame } from './WorkspaceFrame';
import { FrameBrand } from '../FrameBrand';
import { MOCK_FRAME_MENU_ITEMS } from '../../stories/mockMenu';
import type { FrameMenuItem } from '../../types';

const meta: Meta<typeof WorkspaceFrame> = {
  title: 'GenFrame/Layout/LeftPanel',
  component: WorkspaceFrame,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'F1: `leftPanel` layout — header, vertical navigation, and workarea with flex height contract.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const frameStyle: CSSProperties = {
  width: '100%',
  maxWidth: 960,
  height: 480,
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--color-border-default)',
  borderRadius: 8,
  overflow: 'hidden',
  minHeight: 0,
};

const workareaPanelStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  color: 'var(--color-fg-secondary)',
  fontSize: 14,
};

function LeftPanelDemo() {
  const [activeId, setActiveId] = useState('home');

  const handleSelect = (item: FrameMenuItem) => {
    setActiveId(item.id);
  };

  const active = MOCK_FRAME_MENU_ITEMS.flatMap((item) =>
    item.children ? [item, ...item.children] : [item],
  ).find((item) => item.id === activeId);

  return (
    <div style={frameStyle}>
      <WorkspaceFrame
        layout="leftPanel"
        header={<FrameBrand alt="GenOffice Frame" />}
        headerActions={
          <span style={{ fontSize: 13, color: 'var(--color-fg-secondary)' }}>demo user</span>
        }
        menu={{ items: MOCK_FRAME_MENU_ITEMS }}
        menuTitle="Menu"
        menuAriaLabel="Main navigation"
        activeMenuId={activeId}
        onMenuSelect={handleSelect}
        workarea={
          <div style={workareaPanelStyle}>
            Workarea — active: <strong>{active?.label ?? activeId}</strong>
          </div>
        }
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <LeftPanelDemo />,
};

export const WithoutHeader: Story = {
  render: () => (
    <div style={frameStyle}>
      <WorkspaceFrame
        layout="leftPanel"
        menu={{ items: MOCK_FRAME_MENU_ITEMS }}
        menuTitle="Navigation"
        workarea={<div style={workareaPanelStyle}>Content without header chrome</div>}
      />
    </div>
  ),
};
