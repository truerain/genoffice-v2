/**
 * @file packages/ui/test/core/Toast.test.tsx
 * @description Tests for Toast compound primitives.
 * @created 2026-06-24
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from '../../src/core/toast/Toast';

describe('Toast', () => {
  it('renders open toast content', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Done</ToastTitle>
          <ToastDescription>Operation completed.</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Operation completed.')).toBeInTheDocument();
  });
});
