/**
 * @file packages/ui/src/composed/splitLayout/SplitLayout.stories.tsx
 * @description Storybook stories for SplitLayout.
 * @created 2026-06-25
 *
 * @remark
 * - title: UI/Composed/SplitLayout
 * - Parent frame must set explicit height (flex min-height: 0 chain)
 */
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SplitLayout } from './SplitLayout';

const meta: Meta<typeof SplitLayout> = {
  title: 'UI/Composed/SplitLayout',
  component: SplitLayout,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = Pick<Story, 'render'>;

const frameStyle: CSSProperties = {
  width: '100%',
  maxWidth: 720,
  height: 400,
  border: '1px solid var(--color-border-default)',
  borderRadius: 8,
  overflow: 'hidden',
};

function Pane({ label, variant }: { label: string; variant?: 'left' | 'right' }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontSize: '0.875rem',
        color: 'var(--color-fg-secondary)',
        background:
          variant === 'left' ? 'var(--color-bg-secondary)' : 'var(--color-bg-primary)',
        border:
          variant === 'left'
            ? '1px dashed var(--color-border-default)'
            : '1px dashed var(--color-border-subtle)',
        borderRadius: 6,
        margin: 8,
        minHeight: 0,
      }}
    >
      {label}
    </div>
  );
}

export const Default: RenderStory = {
  render: () => (
    <div style={frameStyle}>
      <SplitLayout
        left={<Pane label="Left pane (280px)" variant="left" />}
        right={<Pane label="Right pane (flex)" variant="right" />}
      />
    </div>
  ),
};

export const Resizable: RenderStory = {
  render: () => {
    const [width, setWidth] = useState(280);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-fg-secondary)' }}>
          Drag the handle between panes. Left width: <strong>{Math.round(width)}px</strong>
        </p>
        <div style={frameStyle}>
          <SplitLayout
            resizable
            leftWidth={width}
            minLeftWidth={180}
            minRightWidth={160}
            onResize={setWidth}
            left={<Pane label="Master" variant="left" />}
            right={<Pane label="Detail" variant="right" />}
          />
        </div>
      </div>
    );
  },
};

export const PercentWidth: RenderStory = {
  render: () => (
    <div style={frameStyle}>
      <SplitLayout
        resizable
        leftWidth="40%"
        minLeftWidth={200}
        minRightWidth={200}
        left={<Pane label="40% initial" variant="left" />}
        right={<Pane label="Remaining space" variant="right" />}
      />
    </div>
  ),
};

export const Vertical: RenderStory = {
  render: () => (
    <div style={frameStyle}>
      <SplitLayout
        direction="vertical"
        leftWidth={140}
        left={<Pane label="Top pane" variant="left" />}
        right={<Pane label="Bottom pane" variant="right" />}
      />
    </div>
  ),
};

export const ResizableVertical: RenderStory = {
  render: () => (
    <div style={frameStyle}>
      <SplitLayout
        direction="vertical"
        resizable
        leftWidth={160}
        minLeftWidth={100}
        minRightWidth={120}
        left={<Pane label="Top (drag handle below)" variant="left" />}
        right={<Pane label="Bottom" variant="right" />}
      />
    </div>
  ),
};

export const HiddenResizeLine: RenderStory = {
  render: () => (
    <div style={frameStyle}>
      <SplitLayout
        resizable
        showResizeLine={false}
        left={<Pane label="Invisible line" variant="left" />}
        right={<Pane label="Hit area still 6px" variant="right" />}
      />
    </div>
  ),
};
