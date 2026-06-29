/**
 * @file packages/gen-frame/test/components/NavRenderer.test.tsx
 * @description Tests for NavRenderer and resolveNavLayout.
 * @created 2026-06-29
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NavRenderer, resolveNavLayout } from '../../src/components/NavRenderer/NavRenderer';

const menu = {
  items: [
    { id: 'a', label: 'Alpha' },
    { id: 'b', label: 'Beta' },
  ],
};

describe('resolveNavLayout', () => {
  it('maps titleBar to titleBar', () => {
    expect(resolveNavLayout('titleBar')).toBe('titleBar');
  });

  it('maps hybrid and rail to leftPanel until implemented', () => {
    expect(resolveNavLayout('leftPanel')).toBe('leftPanel');
    expect(resolveNavLayout('hybrid')).toBe('leftPanel');
    expect(resolveNavLayout('rail')).toBe('leftPanel');
  });
});

describe('NavRenderer', () => {
  it('renders left panel navigation', () => {
    render(
      <NavRenderer layout="leftPanel" menu={menu} menuTitle="Side" menuAriaLabel="Side nav" />,
    );
    expect(screen.getByText('Side')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeInTheDocument();
  });

  it('renders title bar navigation', () => {
    render(<NavRenderer layout="titleBar" menu={menu} menuAriaLabel="Top nav" />);
    expect(screen.getByRole('navigation', { name: 'Top nav' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alpha' })).toBeInTheDocument();
  });
});
