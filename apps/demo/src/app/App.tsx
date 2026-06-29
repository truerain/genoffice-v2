/**
 * @file apps/demo/src/app/App.tsx
 * @description Root application shell placeholder (Gate D0).
 * @created 2026-06-28
 *
 * @remark
 * - D1: AppShell, MDI, auth branch
 */

export function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        background: 'var(--color-surface-default, #fff)',
        color: 'var(--color-text-primary, #171717)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>GenOffice V2 Demo</h1>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary, #525252)' }}>
        Gate D0 scaffold — shell·MDI·pages follow in D1+
      </p>
    </div>
  );
}
