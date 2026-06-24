/**
 * @file packages/ui/test/core/Tabs.test.tsx
 * @description Tests for Tabs compound primitives.
 * @created 2026-06-24
 */
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../src/core/tabs/Tabs';

describe('Tabs', () => {
  it('shows content for the active tab', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel one</TabsContent>
        <TabsContent value="two">Panel two</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Panel one')).toBeVisible();
    expect(screen.getByText('Panel two')).not.toBeVisible();

    await user.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByText('Panel two')).toBeVisible();
    expect(screen.getByText('Panel one')).not.toBeVisible();
  });

  it('marks disabled triggers as disabled', () => {
    render(
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="advanced" disabled>
            Advanced
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">General panel</TabsContent>
        <TabsContent value="advanced">Advanced panel</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole('tab', { name: 'Advanced' })).toBeDisabled();
    expect(screen.getByText('General panel')).toBeVisible();
    expect(screen.getByText('Advanced panel')).not.toBeVisible();
  });
});
