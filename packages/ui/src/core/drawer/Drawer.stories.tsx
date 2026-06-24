/**
 * @file packages/ui/src/core/drawer/Drawer.stories.tsx
 * @description Storybook stories for Drawer slide-over panel.
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core3-overlays/Drawer
 * - V1 custom implementation (not Radix)
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from '../button';

const meta: Meta<typeof Drawer> = {
  title: 'UI/Core3-overlays/Drawer',
  component: Drawer,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '24rem', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
/** Controlled open state lives in render(); CSF args not used */
type RenderStory = Pick<Story, 'render'>;

export const Default: RenderStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer
          open={open}
          onOpenChange={setOpen}
          title="Drawer Title"
          description="Optional description for the drawer panel."
        >
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-fg-secondary)' }}>
            Drawer body content. Scroll when content overflows.
          </p>
        </Drawer>
      </>
    );
  },
};

export const WithFooter: RenderStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open with Footer</Button>
        <Drawer
          open={open}
          onOpenChange={setOpen}
          title="Save Changes"
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          }
        >
          <p style={{ margin: 0 }}>Edit form fields here.</p>
        </Drawer>
      </>
    );
  },
};

export const LeftSide: RenderStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Left</Button>
        <Drawer open={open} onOpenChange={setOpen} side="left" title="Left Drawer">
          <p style={{ margin: 0 }}>Slides in from the left edge.</p>
        </Drawer>
      </>
    );
  },
};

export const TopSide: RenderStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Top</Button>
        <Drawer open={open} onOpenChange={setOpen} side="top" title="Top Drawer" size="sm">
          <p style={{ margin: 0 }}>Slides in from the top.</p>
        </Drawer>
      </>
    );
  },
};

export const BottomSide: RenderStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Bottom</Button>
        <Drawer open={open} onOpenChange={setOpen} side="bottom" title="Bottom Drawer" size="md">
          <p style={{ margin: 0 }}>Slides in from the bottom.</p>
        </Drawer>
      </>
    );
  },
};

export const LargeSize: RenderStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Large</Button>
        <Drawer open={open} onOpenChange={setOpen} title="Large Drawer" size="lg">
          <p style={{ margin: 0 }}>640px width on horizontal sides.</p>
        </Drawer>
      </>
    );
  },
};

export const NoOverlayClose: RenderStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open (overlay click disabled)</Button>
        <Drawer
          open={open}
          onOpenChange={setOpen}
          title="Sticky Overlay"
          closeOnOverlayClick={false}
          footer={<Button onClick={() => setOpen(false)}>Close</Button>}
        >
          <p style={{ margin: 0 }}>Use the footer button or X to close.</p>
        </Drawer>
      </>
    );
  },
};
