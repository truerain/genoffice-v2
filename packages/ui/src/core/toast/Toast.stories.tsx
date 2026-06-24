/**
 * @file packages/ui/src/core/toast/Toast.stories.tsx
 * @description Storybook stories for Toast compound primitives.
 * @created 2026-06-24
 *
 * @remark
 * - title: UI/Core5-feedback/Toast
 */
import type { Meta, StoryObj } from '@storybook/react';
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

const meta: Meta<typeof ToastProvider> = {
  title: 'UI/Core5-feedback/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'centered',
  },
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
        <ToastViewport />
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
        <ToastViewport />
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
        <ToastViewport />
      </ToastProvider>
    );
  },
};
