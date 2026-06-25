/**
 * @file packages/ui/test/composed/SplitLayout.test.tsx
 * @description Tests for SplitLayout composed component.
 * @created 2026-06-25
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SplitLayout } from '../../src/composed/splitLayout';

describe('SplitLayout', () => {
  it('renders left and right panes', () => {
    render(
      <SplitLayout
        left={<div>Left content</div>}
        right={<div>Right content</div>}
      />
    );

    expect(screen.getByText('Left content')).toBeInTheDocument();
    expect(screen.getByText('Right content')).toBeInTheDocument();
  });

  it('renders two children when not resizable', () => {
    const { container } = render(
      <SplitLayout left={<span>Left</span>} right={<span>Right</span>} />
    );

    const root = container.firstElementChild;
    expect(root?.childElementCount).toBe(2);
  });

  it('renders resizer between panes when resizable', () => {
    const { container } = render(
      <SplitLayout
        resizable
        left={<span>Left</span>}
        right={<span>Right</span>}
      />
    );

    const root = container.firstElementChild;
    expect(root?.childElementCount).toBe(3);
  });

  it('applies custom className props', () => {
    const { container } = render(
      <SplitLayout
        className="split-root"
        leftClassName="split-left"
        rightClassName="split-right"
        left={<span>Left</span>}
        right={<span>Right</span>}
      />
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass('split-root');
    expect(root?.firstElementChild).toHaveClass('split-left');
    expect(root?.lastElementChild).toHaveClass('split-right');
  });
});
