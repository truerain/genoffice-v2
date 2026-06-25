/**
 * @file packages/ui/test/composed/FilterBar.test.tsx
 * @description Tests for FilterBar compound layout.
 * @created 2026-06-25
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from '../../src/composed/filterBar';

describe('FilterBar', () => {
  it('renders filter items and column actions', () => {
    const { container } = render(
      <FilterBar actions={<button type="button">Search</button>}>
        <FilterBar.Item label="Name">
          <input aria-label="name" />
        </FilterBar.Item>
      </FilterBar>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'name' })).toBeInTheDocument();
    expect(container.querySelector('[class*="filterBarMain"]')).toBeTruthy();
    expect(container.querySelector('[class*="filterActionsColumn"]')).toBeTruthy();
  });

  it('applies size preset class', () => {
    const { container } = render(
      <FilterBar>
        <FilterBar.Item label="Code" size="xs">
          <span>Field</span>
        </FilterBar.Item>
      </FilterBar>
    );

    expect(container.querySelector('[class*="filterItemSizeXs"]')).toBeTruthy();
  });

  it('maps legacy flex grow to fill size', () => {
    const { container } = render(
      <FilterBar>
        <FilterBar.Item flex={1}>
          <span>Grow</span>
        </FilterBar.Item>
      </FilterBar>
    );

    expect(container.querySelector('[class*="filterItemSizeFill"]')).toBeTruthy();
  });

  it('supports legacy explicit width', () => {
    const { container } = render(
      <FilterBar>
        <FilterBar.Item width="180px" flex={0}>
          <span>Fixed</span>
        </FilterBar.Item>
      </FilterBar>
    );

    const item = container.querySelector('[class*="filterItemLegacy"]') as HTMLElement;
    expect(item).toBeTruthy();
    expect(item.style.width).toBe('180px');
  });

  it('omits label row when label is not provided', () => {
    render(
      <FilterBar>
        <FilterBar.Item>
          <span>Field only</span>
        </FilterBar.Item>
      </FilterBar>
    );

    expect(screen.getByText('Field only')).toBeInTheDocument();
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
  });

  it('renders horizontal item layout class', () => {
    const { container } = render(
      <FilterBar>
        <FilterBar.Item label="Code" layout="horizontal">
          <input aria-label="code" />
        </FilterBar.Item>
      </FilterBar>
    );

    expect(container.querySelector('[class*="filterItemHorizontal"]')).toBeTruthy();
  });

  it('inherits itemLayout from FilterBar', () => {
    const { container } = render(
      <FilterBar itemLayout="horizontal">
        <FilterBar.Item label="Name">
          <input aria-label="name" />
        </FilterBar.Item>
      </FilterBar>
    );

    expect(container.querySelector('[class*="filterItemHorizontal"]')).toBeTruthy();
  });

  it('renders inline actions placement', () => {
    const { container } = render(
      <FilterBar actions={<button type="button">Search</button>} actionsPlacement="inline">
        <FilterBar.Item label="Name">
          <input aria-label="name" />
        </FilterBar.Item>
      </FilterBar>
    );

    expect(container.querySelector('[class*="filterRowInline"]')).toBeTruthy();
    expect(container.querySelector('[class*="filterActionsInline"]')).toBeTruthy();
    expect(container.querySelector('[class*="filterActionsColumn"]')).toBeFalsy();
  });

  it('toggles visible fields when collapsible', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <FilterBar collapsible collapsedCount={3} actions={<button type="button">Search</button>}>
        <FilterBar.Item label="Field A" size="sm">
          <span>value-a</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field B" size="sm">
          <span>value-b</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field C" size="sm">
          <span>value-c</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field D" size="sm">
          <span>value-d</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field E" size="sm">
          <span>value-e</span>
        </FilterBar.Item>
      </FilterBar>
    );

    expect(screen.getByText('Field A')).toBeInTheDocument();
    expect(screen.getByText('Field C')).toBeInTheDocument();
    expect(screen.queryByText('Field D')).not.toBeInTheDocument();
    expect(container.querySelector('[class*="filterBarBorderlessBottom"]')).toBeTruthy();
    expect(container.querySelector('[class*="filterCollapseBorder"]')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: '상세' }));
    expect(screen.getByText('Field D')).toBeInTheDocument();
    expect(screen.getByText('Field E')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '간단히' }));
    expect(screen.queryByText('Field D')).not.toBeInTheDocument();
  });

  it('shows only simple-marked items when collapsible', () => {
    render(
      <FilterBar collapsible collapsedCount={3} actions={<button type="button">Search</button>}>
        <FilterBar.Item label="Always" size="sm" simple>
          <span>always</span>
        </FilterBar.Item>
        <FilterBar.Item label="Hidden" size="sm">
          <span>hidden</span>
        </FilterBar.Item>
      </FilterBar>
    );

    expect(screen.getByText('Always')).toBeInTheDocument();
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('renders actions-icon collapse toggle', () => {
    const { container } = render(
      <FilterBar
        collapsible
        collapsedCount={2}
        collapseToggle="actions-icon"
        actions={<button type="button">Search</button>}
      >
        <FilterBar.Item label="Field A" size="sm">
          <span>a</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field B" size="sm">
          <span>b</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field C" size="sm">
          <span>c</span>
        </FilterBar.Item>
      </FilterBar>
    );

    expect(container.querySelector('[class*="filterBarBorderlessBottom"]')).toBeFalsy();
    expect(screen.getByRole('button', { name: '상세' })).toBeInTheDocument();
  });

  it('renders border collapse toggle', () => {
    const { container } = render(
      <FilterBar
        collapsible
        collapsedCount={2}
        collapseToggle="border"
        actions={<button type="button">Search</button>}
      >
        <FilterBar.Item label="Field A" size="sm">
          <span>a</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field B" size="sm">
          <span>b</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field C" size="sm">
          <span>c</span>
        </FilterBar.Item>
      </FilterBar>
    );

    expect(container.querySelector('[class*="filterCollapseBorder"]')).toBeTruthy();
    expect(container.querySelector('[class*="filterBarBorderlessBottom"]')).toBeTruthy();
  });

  it('skips borderless bottom border when borderedPanel', () => {
    const { container } = render(
      <FilterBar
        borderedPanel
        collapsible
        collapsedCount={2}
        actions={<button type="button">Search</button>}
      >
        <FilterBar.Item label="Field A" size="sm">
          <span>a</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field B" size="sm">
          <span>b</span>
        </FilterBar.Item>
        <FilterBar.Item label="Field C" size="sm">
          <span>c</span>
        </FilterBar.Item>
      </FilterBar>
    );

    expect(container.querySelector('[class*="filterCollapseBorder"]')).toBeTruthy();
    expect(container.querySelector('[class*="filterBarBorderlessBottom"]')).toBeFalsy();
  });
});
