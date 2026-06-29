/**
 * @file packages/gen-frame/test/components/SinglePageHost.test.tsx
 * @description Tests for SinglePageHost.
 * @created 2026-06-29
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SinglePageHost } from '../../src/components/SinglePageHost';

describe('SinglePageHost', () => {
  it('renders empty content when no page is active', () => {
    render(<SinglePageHost page={null} emptyContent={<span>No page</span>} />);
    expect(screen.getByText('No page')).toBeInTheDocument();
  });

  it('renders page content when a page is active', () => {
    render(
      <SinglePageHost
        page={{
          pageId: 'home',
          title: 'Home',
          content: <span>Home content</span>,
        }}
      />,
    );

    expect(screen.getByText('Home content')).toBeInTheDocument();
    expect(document.querySelector('[data-page-id="home"]')).not.toBeNull();
  });
});
