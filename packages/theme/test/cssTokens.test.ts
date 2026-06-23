/**
 * @file packages/theme/test/cssTokens.test.ts
 * @description Regression checks for required CSS custom properties in token files.
 * @created 2026-06-22
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const testDir = dirname(fileURLToPath(import.meta.url));
const tokenDir = resolve(testDir, '../src/styles/tokens');

function readTokenFile(...segments: string[]) {
  return readFileSync(resolve(tokenDir, ...segments), 'utf8');
}

const semanticVars = [
  '--color-bg-primary',
  '--color-bg-secondary',
  '--color-fg-primary',
  '--color-border-default',
  '--color-status-success',
  '--color-status-error',
];

const componentVars: Record<string, string[]> = {
  'components/button.css': ['--button-primary-bg', '--button-focus-ring'],
  'components/dialog.css': ['--dialog-bg', '--dialog-border'],
  'components/grid.css': ['--grid-bg', '--grid-border'],
};

describe('CSS token files', () => {
  it('semantic.css defines UI semantic aliases', () => {
    const css = readTokenFile('semantic.css');
    for (const name of semanticVars) {
      expect(css, `missing ${name}`).toContain(name);
    }
  });

  it('base.css defines primary accent and bootstrap status colors', () => {
    const css = readTokenFile('base.css');
    expect(css).toContain('--color-primary: #c6004d');
    expect(css).toContain('--color-primary-light: #fde8ef');
    expect(css).toContain('--color-primary-dark: #9e003e');
    expect(css).toContain('--color-success: #28a745');
    expect(css).not.toContain('--color-brand');
  });

  it('theme-dark.css scopes overrides to data-theme=dark', () => {
    const css = readTokenFile('theme-dark.css');
    expect(css).toContain('[data-theme="dark"]');
    expect(css).toContain('--color-bg-primary');
  });

  it('component token files define expected variables', () => {
    for (const [file, vars] of Object.entries(componentVars)) {
      const css = readTokenFile(file);
      for (const name of vars) {
        expect(css, `${file} missing ${name}`).toContain(name);
      }
    }
  });

  it('variables.css aggregates token layers', () => {
    const css = readFileSync(resolve(testDir, '../src/styles/variables.css'), 'utf8');
    expect(css).toContain("tokens/base.css");
    expect(css).toContain("tokens/semantic.css");
    expect(css).toContain("tokens/theme-dark.css");
    expect(css).toContain('components/button.css');
  });
});
