/**
 * @file packages/gen-frame/src/components/TitleBarNav/TitleBarNav.stories.tsx
 * @description Storybook stories for TitleBarNav (Gate F2).
 * @created 2026-06-29
 *
 * @remark
 * - title: GenFrame/Layout/TitleBar
 *
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TitleBarNav } from './TitleBarNav';
import { MOCK_FRAME_MENU_ITEMS } from '../../stories/mockMenu';
import type { FrameMenuItem } from '../../types';

const meta: Meta<typeof TitleBarNav> = {
  title: 'GenFrame/Layout/TitleBar',
  component: TitleBarNav,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'F2: horizontal title-bar navigation with dropdown submenus.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

function TitleBarNavDemo() {
  const [activeId, setActiveId] = useState('home');

  return (
    <div style={{ padding: 12, border: '1px solid var(--color-border-default)', borderRadius: 8 }}>
      <TitleBarNav
        items={MOCK_FRAME_MENU_ITEMS}
        activeId={activeId}
        onSelect={(item: FrameMenuItem) => setActiveId(item.id)}
      />
      <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--color-fg-secondary)' }}>
        Active: <strong>{activeId}</strong>
      </p>
    </div>
  );
}

export const Default: Story = {
  render: () => <TitleBarNavDemo />,
};
