/**
 * @file packages/ui/src/core/dialog/StandardDialog.stories.tsx
 * @description Storybook stories for StandardDialog (back-office default modal).
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core/StandardDialog
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StandardDialog } from './StandardDialog';
import { Button } from '../button';

/** Demo height so body flex region is visible in Storybook */
const DEMO_DIALOG_HEIGHT = 420;

function DemoBody({ lines = 3 }: { lines?: number }) {
  const copy =
    'Back-office modal body. Header and footer stay fixed while this region scrolls when content overflows.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {Array.from({ length: lines }, (_, index) => (
        <p key={index} style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-fg-secondary)' }}>
          {copy}
        </p>
      ))}
    </div>
  );
}

const meta = {
  title: 'UI/Core/StandardDialog',
  component: StandardDialog,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '32rem', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof StandardDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open StandardDialog</Button>
        <StandardDialog
          open={open}
          onOpenChange={setOpen}
          title="Dialog Title"
          initialHeight={DEMO_DIALOG_HEIGHT}
        >
          <DemoBody />
        </StandardDialog>
      </>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open with Footer</Button>
        <StandardDialog
          open={open}
          onOpenChange={setOpen}
          title="Save Changes"
          initialHeight={DEMO_DIALOG_HEIGHT}
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          }
        >
          <DemoBody />
        </StandardDialog>
      </>
    );
  },
};

export const Resizable: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Resizable</Button>
        <StandardDialog
          open={open}
          onOpenChange={setOpen}
          title="Resizable Dialog"
          resizable
          initialWidth={640}
          initialHeight={DEMO_DIALOG_HEIGHT}
          minResizableWidth={400}
          minResizableHeight={280}
        >
          <DemoBody lines={6} />
        </StandardDialog>
      </>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
    const [open, setOpen] = useState(false);

    return (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
          <Button
            key={s}
            variant={size === s ? 'primary' : 'outline'}
            onClick={() => {
              setSize(s);
              setOpen(true);
            }}
          >
            {s}
          </Button>
        ))}
        <StandardDialog
          open={open}
          onOpenChange={setOpen}
          title={`Size: ${size}`}
          size={size}
          initialHeight={DEMO_DIALOG_HEIGHT}
        >
          <DemoBody />
        </StandardDialog>
      </div>
    );
  },
};
