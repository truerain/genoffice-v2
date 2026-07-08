/**
 * @file packages/theme/src/stories/Theme.stories.tsx
 * @description Storybook stories for @gen-office/theme tokens and ThemeProvider.
 * @created 2026-06-22
 *
 * @remark
 * - title `Theme/Theme` (not single-level `Theme`): Storybook storySort matches root
 *   kinds from the first path segment; a lone root is treated differently in the sidebar.
 */
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';
import { ThemeProvider } from '../provider/ThemeProvider';

const meta = {
  title: 'Theme/Theme',
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story: StoryFn) => (
      <ThemeProvider defaultMode="light" storageKey="gen-office-storybook-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function ColorSwatch({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 100 }}>
      <div
        style={{
          width: 96,
          height: 48,
          borderRadius: 6,
          background: value || 'transparent',
          border: '1px solid var(--color-border-default)',
        }}
      />
      <span style={{ fontSize: 12, color: 'var(--color-fg-primary)' }}>{label}</span>
      <code style={{ fontSize: 10, color: 'var(--color-fg-secondary)' }}>{value || '(empty)'}</code>
    </div>
  );
}

function CssVarSwatch({ label, cssVar }: { label: string; cssVar: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 }}>
      <div
        style={{
          width: 96,
          height: 48,
          borderRadius: 6,
          background: `var(${cssVar})`,
          border: '1px solid var(--color-border-default)',
        }}
      />
      <span style={{ fontSize: 12, color: 'var(--color-fg-primary)' }}>{label}</span>
      <code style={{ fontSize: 10, color: 'var(--color-fg-secondary)' }}>{cssVar}</code>
    </div>
  );
}

function SwatchGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        padding: 16,
        background: 'var(--color-bg-primary)',
        color: 'var(--color-fg-primary)',
        borderRadius: 8,
        border: '1px solid var(--color-border-default)',
      }}
    >
      {children}
    </div>
  );
}

function ThemeModePanel() {
  const { mode, setMode, toggleMode, theme } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <p style={{ margin: 0, color: 'var(--color-fg-secondary)' }}>
        `useTheme()`로 읽은 현재 모드와 CSS 변수 기반 색상입니다. 아래 버튼으로 light/dark를
        전환할 수 있습니다.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={toggleMode}>
          Toggle ({mode})
        </button>
        <button type="button" onClick={() => setMode('light')}>
          Light
        </button>
        <button type="button" onClick={() => setMode('dark')}>
          Dark
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: 12,
          fontSize: 11,
          overflow: 'auto',
          background: 'var(--color-bg-secondary)',
          borderRadius: 6,
          border: '1px solid var(--color-border-default)',
        }}
      >
        {JSON.stringify(theme.colors.background, null, 2)}
      </pre>
    </div>
  );
}

function SemanticColorsPanel() {
  const { theme } = useTheme();
  const { background, foreground, primary, status, border } = theme.colors;

  return (
    <SwatchGrid>
      <ColorSwatch label="bg.primary" value={background.primary} />
      <ColorSwatch label="bg.secondary" value={background.secondary} />
      <ColorSwatch label="bg.tertiary" value={background.tertiary} />
      <ColorSwatch label="fg.primary" value={foreground.primary} />
      <ColorSwatch label="fg.secondary" value={foreground.secondary} />
      <ColorSwatch label="primary.default" value={primary.default} />
      <ColorSwatch label="primary.dark" value={primary.dark} />
      <ColorSwatch label="status.success" value={status.success} />
      <ColorSwatch label="status.warning" value={status.warning} />
      <ColorSwatch label="status.error" value={status.error} />
      <ColorSwatch label="status.info" value={status.info} />
      <ColorSwatch label="border.default" value={border.default} />
      <ColorSwatch label="border.strong" value={border.strong} />
    </SwatchGrid>
  );
}

function ComponentTokensPanel() {
  return (
    <SwatchGrid>
      <CssVarSwatch label="Button primary bg" cssVar="--button-primary-bg" />
      <CssVarSwatch label="Button default border" cssVar="--button-default-border" />
      <CssVarSwatch label="Dialog bg" cssVar="--dialog-bg" />
      <CssVarSwatch label="Dialog border" cssVar="--dialog-border" />
    </SwatchGrid>
  );
}

function TypographySample() {
  return (
    <div
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: 'var(--color-bg-primary)',
        color: 'var(--color-fg-primary)',
        fontFamily: 'var(--font-family-primary)',
        borderRadius: 8,
        border: '1px solid var(--color-border-default)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 'var(--font-size-2xl, 1.5rem)' }}>Heading / 제목</h1>
      <p style={{ margin: 0, color: 'var(--color-fg-secondary)' }}>
        Body text — semantic tokens drive foreground and background colors.
      </p>
      <a href="#typography" style={{ color: 'var(--color-primary)' }}>
        Link accent (--color-primary)
      </a>
    </div>
  );
}

export const ModeAndContext: Story = {
  render: () => <ThemeModePanel />,
};

export const SemanticColors: Story = {
  render: () => <SemanticColorsPanel />,
};

export const ComponentTokens: Story = {
  render: () => <ComponentTokensPanel />,
};

export const Typography: Story = {
  render: () => <TypographySample />,
};
