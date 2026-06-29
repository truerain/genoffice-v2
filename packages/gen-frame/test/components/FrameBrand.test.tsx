/**
 * @file packages/gen-frame/test/components/FrameBrand.test.tsx
 * @description Tests for FrameBrand.
 * @created 2026-06-29
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DEFAULT_FRAME_BRAND_LOGO_SRC } from '../../src/assets/defaultBrandLogo';
import { FrameBrand } from '../../src/components/FrameBrand';

describe('FrameBrand', () => {
  it('renders default logo when src is omitted', () => {
    render(<FrameBrand alt="GenOffice" />);
    const img = screen.getByRole('img', { name: 'GenOffice' });
    expect(img).toHaveAttribute('src', DEFAULT_FRAME_BRAND_LOGO_SRC);
  });

  it('renders custom src when provided', () => {
    render(<FrameBrand src="/custom-logo.png" alt="Custom" />);
    expect(screen.getByRole('img', { name: 'Custom' })).toHaveAttribute('src', '/custom-logo.png');
  });

  it('renders children instead of image', () => {
    render(
      <FrameBrand>
        <span>Custom brand</span>
      </FrameBrand>,
    );
    expect(screen.getByText('Custom brand')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
