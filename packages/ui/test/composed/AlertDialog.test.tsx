/**
 * @file packages/ui/test/composed/AlertDialog.test.tsx
 * @description Tests for AlertDialog composed component.
 * @created 2026-06-25
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertDialog } from '../../src/composed/alertDialog';

describe('AlertDialog', () => {
  it('renders title and message when open', () => {
    render(
      <AlertDialog
        open
        onOpenChange={() => {}}
        title="알림 제목"
        message="본문 메시지"
        onConfirm={() => {}}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('알림 제목')).toBeInTheDocument();
    expect(screen.getByText('본문 메시지')).toBeInTheDocument();
  });

  it('calls onConfirm and closes on confirm click', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <AlertDialog
        open
        onOpenChange={onOpenChange}
        title="확인"
        message="진행할까요?"
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onCancel and closes on cancel click', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <AlertDialog
        open
        onOpenChange={onOpenChange}
        title="확인"
        message="취소 테스트"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('hides cancel button when hideCancelButton is true', () => {
    render(
      <AlertDialog
        open
        onOpenChange={() => {}}
        title="알림"
        message="확인만"
        hideCancelButton
        onConfirm={() => {}}
      />
    );

    expect(screen.queryByRole('button', { name: '취소' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();
  });

  it('does not close when onConfirm rejects', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockRejectedValue(new Error('fail'));
    const onOpenChange = vi.fn();

    render(
      <AlertDialog
        open
        onOpenChange={onOpenChange}
        title="오류"
        message="실패 시 닫히지 않음"
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
