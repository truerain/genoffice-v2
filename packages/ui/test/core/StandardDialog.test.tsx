/**
 * @file packages/ui/test/core/StandardDialog.test.tsx
 * @description Tests for StandardDialog.
 * @created 2026-06-24
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StandardDialog } from '../../src/core/dialog/StandardDialog';

describe('StandardDialog', () => {
  it('renders title and content when open', () => {
    render(
      <StandardDialog open title="Settings">
        <p>Options here</p>
      </StandardDialog>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Options here')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <StandardDialog open={false} title="Hidden">
        <p>Hidden body</p>
      </StandardDialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
