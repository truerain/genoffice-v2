/**
 * @file packages/ui/src/core/toast/Toast.stories.tsx
 * @description Storybook stories for Toast compound primitives.
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core5-feedback/Toast
 * - Default stories: frame + absolute viewport (compact preview)
 * - RadixSlide: `layout: fullscreen` + browser `fixed` viewport (앱과 동일)
 */
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from './Toast';
import { Button } from '../button';
import storyStyles from './Toast.stories.module.css';

function ToastStoryFrame({ children }: { children: ReactNode }) {
  return <div className={storyStyles.frame}>{children}</div>;
}

const meta: Meta<typeof ToastProvider> = {
  title: 'UI/Core5-feedback/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'padded',
    toastUseBrowserViewport: false,
  },
  decorators: [
    (Story, { parameters }) => {
      if (parameters.toastUseBrowserViewport) {
        return <Story />;
      }

      return (
        <ToastStoryFrame>
          <Story />
        </ToastStoryFrame>
      );
    },
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = Pick<Story, 'render'>;

export const Default: RenderStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider duration={4000}>
        <Button onClick={() => setOpen(true)}>Show toast</Button>
        <Toast open={open} onOpenChange={setOpen}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Your changes were saved successfully.</ToastDescription>
          <ToastClose />
        </Toast>
        <ToastViewport className={storyStyles.viewport} />
      </ToastProvider>
    );
  },
};

export const WithAction: RenderStory = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider>
        <Button onClick={() => setOpen(true)}>Show action toast</Button>
        <Toast open={open} onOpenChange={setOpen} variant="success">
          <ToastTitle>File uploaded</ToastTitle>
          <ToastDescription>report-q1.xlsx is ready.</ToastDescription>
          <ToastAction altText="Open file" onClick={() => setOpen(false)}>
            Open
          </ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport className={storyStyles.viewport} />
      </ToastProvider>
    );
  },
};

export const Variants: RenderStory = {
  render: () => {
    const [active, setActive] = useState<'default' | 'success' | 'warning' | 'error' | null>(null);

    return (
      <ToastProvider>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['default', 'success', 'warning', 'error'] as const).map((variant) => (
            <Button key={variant} variant="outline" onClick={() => setActive(variant)}>
              {variant}
            </Button>
          ))}
        </div>
        {active && (
          <Toast open onOpenChange={(next) => !next && setActive(null)} variant={active}>
            <ToastTitle>{active} toast</ToastTitle>
            <ToastDescription>Variant preview for {active}.</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport className={storyStyles.viewport} />
      </ToastProvider>
    );
  },
};

/** Radix docs demo: browser bottom-right `fixed` viewport + slide animation */
export const RadixSlide: RenderStory = {
  parameters: {
    layout: 'fullscreen',
    toastUseBrowserViewport: true,
    docs: {
      description: {
        story:
          'Storybook canvas를 벗어나 iframe body 우하단에 표시 (`ToastViewport portalled` + Radix slide-in).',
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <ToastProvider duration={5000} swipeDirection="right">
        <div style={{ padding: '2rem' }}>
          <Button onClick={() => setOpen(true)}>Add toast</Button>
        </div>
        <Toast open={open} onOpenChange={setOpen} className={storyStyles.radixSlide}>
          <ToastTitle>Scheduled: Catch up</ToastTitle>
          <ToastDescription>Friday, February 10, 2023 at 5:57 PM</ToastDescription>
          <ToastClose />
        </Toast>
        <ToastViewport portalled className={storyStyles.radixViewport} />
      </ToastProvider>
    );
  },
};
