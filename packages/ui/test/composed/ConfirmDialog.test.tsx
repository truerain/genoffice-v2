/**
 * @file packages/ui/test/composed/ConfirmDialog.test.tsx
 * @description Tests for ConfirmDialog composed component.
 * @created 2026-06-25
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '../../src/composed/confirmDialog';

describe('ConfirmDialog', () => {
  it('renders with default labels and confirm flow', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="저장 확인"
        message="변경 사항을 저장하시겠습니까?"
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('저장 확인')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('forwards custom confirmText', () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="삭제"
        message="삭제합니다."
        confirmText="삭제"
        onConfirm={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument();
  });
});
