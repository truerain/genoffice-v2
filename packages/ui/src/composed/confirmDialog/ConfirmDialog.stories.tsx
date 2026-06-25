/**
 * @file packages/ui/src/composed/confirmDialog/ConfirmDialog.stories.tsx
 * @description Storybook stories for ConfirmDialog.
 * @created 2026-06-25
 *
 * @remark
 * - title: UI/Composed/ConfirmDialog
 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from '../../core/button';
import type { ConfirmDialogProps } from './ConfirmDialog.types';

const meta: Meta = {
  title: 'UI/Composed/ConfirmDialog',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const InteractiveConfirmDialog = (
  props: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>
) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Confirm</Button>
      <ConfirmDialog open={open} onOpenChange={setOpen} {...props} />
    </>
  );
};

export const Default: Story = {
  render: () => (
    <InteractiveConfirmDialog
      title="계속하시겠습니까?"
      message="저장하지 않은 변경 사항이 있습니다."
      onConfirm={() => console.log('Confirmed')}
    />
  ),
};

export const Delete: Story = {
  render: () => (
    <InteractiveConfirmDialog
      variant="error"
      title="삭제 확인"
      message="선택한 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      confirmText="삭제"
      onConfirm={() => console.log('Deleted')}
    />
  ),
};

export const AsyncConfirm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    const handleConfirm = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>비동기 확인</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="저장 확인"
          message="변경 사항을 서버에 저장합니다."
          onConfirm={handleConfirm}
        />
      </>
    );
  },
};
