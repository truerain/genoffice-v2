/**
 * @file packages/ui/test/core/Slider.test.tsx
 * @description Tests for Slider.
 * @created 2026-06-23
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Slider } from '../../src/core/slider/Slider';
import styles from '../../src/core/slider/Slider.module.css';

describe('Slider', () => {
  it('renders with slider role', () => {
    render(<Slider defaultValue={[50]} aria-label="Volume" />);
    expect(screen.getByLabelText('Volume')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50');
  });

  it('renders range slider with two thumbs', () => {
    render(<Slider defaultValue={[20, 80]} aria-label="Price range" />);
    expect(screen.getByLabelText('Price range')).toBeInTheDocument();
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });

  it('applies error class when error', () => {
    const { container } = render(<Slider defaultValue={[50]} aria-label="Volume" error />);
    expect(container.firstChild).toHaveClass(styles.error);
  });

  it('applies size class', () => {
    const { container } = render(<Slider defaultValue={[50]} aria-label="Volume" size="lg" />);
    expect(container.firstChild).toHaveClass(styles.sizeLg);
  });
});
