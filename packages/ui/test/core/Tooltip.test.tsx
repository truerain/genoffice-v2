/**
 * @file packages/ui/test/core/Tooltip.test.tsx
 * @description Tests for Tooltip compound primitives.
 * @created 2026-06-24
 */
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../src/core/tooltip/Tooltip';

describe('Tooltip', () => {
  it('shows content on trigger hover', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Tooltip body</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Trigger' }));

    await waitFor(() => {
      expect(screen.getByRole('tooltip', { name: 'Tooltip body' })).toBeInTheDocument();
    });
  });
});
