# GenOffice V2 Agent Rules

This file defines the working rules for AI coding agents in the GenOffice V2 (`genoffice-v2`) repository.

Use this file as the shared instruction source across Codex, ChatGPT, Claude, Gemini, Cursor, Copilot, and other coding agents. If another tool has its own instruction file, mirror the same project rules from this document instead of creating conflicting guidance.

## Repository Context

- This repository is **GenOffice V2**, a React-based framework for building enterprise back-office applications.
- V1 lives in the sibling workspace [`frontend`](../frontend). V2 replaces the V1 grid stack and rebuilds chart APIs; do not treat V1 as the target architecture for new work.
- The repository is a **pnpm monorepo** with apps under `apps/*` and reusable packages under `packages/*`.
- The package scope is `@gen-office/*`.
- The primary demo app is `apps/demo`.
- The integrated Storybook app is `apps/storybook-all`.
- Project-level design docs live under `.docs/`. Start with [`.docs/README.md`](./.docs/README.md).

## Work Split

Two tracks run in parallel:

| Track | Owner | Scope |
| --- | --- | --- |
| **Grid** | Another agent | `packages/gen-datagrid` through Gate 8 / MVP acceptance |
| **Package review** | Human-led review with agent help | All other packages and apps, bottom-up per [`.docs/06-PACKAGE-REVIEW-PLAN.md`](./.docs/06-PACKAGE-REVIEW-PLAN.md) |

When working in this repository:

- Do **not** add or restore V1 packages `gen-grid`, `gen-grid-crud`, or `gen-grid-chart`.
- Do **not** port V1 `GenChart.tsx` monolith into V2; follow [`.docs/05-GEN-CHART.md`](./.docs/05-GEN-CHART.md).
- Prefer the package review order: `tsconfig` → `theme` → `utils` → `ui` → `mdi` → `gen-chart` → … → apps.
- Touch `gen-datagrid-crud`, `gen-datagrid-chart`, or demo grid pages only after `gen-datagrid` public API is stable.

## Core Stack

- React 18 (React 19 is under consideration; do not upgrade without explicit request)
- TypeScript 5.7+
- Vite 6
- pnpm 9
- Turbo
- Nx
- Storybook 8
- TanStack Table (grid state model)
- Radix UI (`ui`)
- visx (`gen-chart`, composable API — not V1 monolith)

## Package Boundaries

Keep package responsibilities clear.

- `packages/tsconfig`: shared TypeScript configuration.
- `packages/theme`: design tokens, global styles, fonts, and theme primitives.
- `packages/utils`: shared, domain-neutral utility functions (no React dependency).
- `packages/ui`: domain-neutral UI components built on Radix and theme tokens.
- `packages/mdi`: multiple document interface layout and tab/window behavior.
- `packages/gen-datagrid`: **core** div-based data grid (TanStack Table + div renderer). Owned by the grid track.
- `packages/gen-datagrid-crud`: CRUD toolbar, row status, dirty integration, Excel export on top of GenDataGrid.
- `packages/gen-datagrid-chart`: grid selection range → chart model integration.
- `packages/gen-chart`: headless + composable chart components (V2 redesign; see `.docs/05-GEN-CHART.md`).

**Not in V2:** `gen-grid`, `gen-grid-crud`, `gen-grid-chart`, and V1 `gen-chart` implementation code.

Preferred dependency direction:

```text
apps -> feature packages (gen-datagrid-crud, gen-datagrid-chart, mdi, gen-chart)
     -> gen-datagrid -> ui -> theme/utils
```

Avoid reverse dependencies and circular dependencies.

Large feature components with heavy third-party engines should usually become separate feature packages instead of being added to `packages/ui`. For example, a rich HTML editor should be considered as `@gen-office/html-editor` because it may own TipTap/ProseMirror dependencies, serialization, sanitization, toolbar commands, and editor-specific policies.

## Documentation Rules

- Update documentation when changing public APIs, package boundaries, behavior contracts, setup steps, or architectural decisions.
- **V2 documentation location:** use `.docs/` (dot-docs), not `docs/`.
  - Repository-level: `.docs/` at the repo root (overview, roadmap, architecture).
  - Package-level: `packages/<name>/.docs/` (review logs, API notes, implementation logs).
- Do not create new V2 documentation under `docs/` or `packages/*/docs/`. V1 paths under `frontend/docs/` and `frontend/packages/*/docs/` are external references only.
- Do not leave important implementation decisions only in chat history.
- Keep README files focused on orientation, setup, and public usage.
- Key V2 references:
  - [`.docs/01-OVERVIEW.md`](./.docs/01-OVERVIEW.md) — goals and MVP
  - [`.docs/02-ARCHITECTURE.md`](./.docs/02-ARCHITECTURE.md) — structure and dependencies
  - [`.docs/03-V1-RELATIONSHIP.md`](./.docs/03-V1-RELATIONSHIP.md) — what to port vs exclude from V1
  - [`.docs/04-ROADMAP.md`](./.docs/04-ROADMAP.md) — phases and milestones
  - [`.docs/05-GEN-CHART.md`](./.docs/05-GEN-CHART.md) — chart redesign
  - [`.docs/06-PACKAGE-REVIEW-PLAN.md`](./.docs/06-PACKAGE-REVIEW-PLAN.md) — package review order

## Work Log Rules

- Every file-changing task must leave a written log.
- For repository-level changes, update `.docs/logs/work-log.md` (create the file when implementation starts if it does not exist yet).
- For architecture, package boundary, or technology decisions, update `.docs/logs/decisions.md`.
- For package-specific changes during the **package review track**, prefer `packages/<name>/.docs/review-log.md` as defined in `.docs/06-PACKAGE-REVIEW-PLAN.md`. Packages may also use `packages/<name>/.docs/implementation-log.md` (for example `packages/theme/.docs/implementation-log.md`).
- Write all work log and decision log entries in **Korean**.
- Log entries should be concise but must include the date, summary, changed area, and relevant files.
- Keep log files in reverse chronological order.
- Add new log entries near the top of the file.
- Within the same date section, place the newest entry first.
- Do not rely on chat history as the only record of why a change was made.
- If a change intentionally skips a log update, explain the reason in the final response.

## AI Coding Workflow

- Default to Plan Mode for all development work.
- In Plan Mode, do not modify source files, configuration files, documentation, or generated assets until the user explicitly asks you to implement, code, edit, apply, or update files.
- Before editing files, first inspect the relevant context, explain the proposed plan, and wait for the user's confirmation.
- A discussion about possible design, architecture, package boundaries, or implementation approach is not permission to edit files.
- A request to "review", "analyze", "plan", "recommend", "explain", or "think through" is not permission to edit files.
- Start modifying files only after the user clearly requests implementation, for example: "implement it", "make the change", "edit the file", "apply this", "코딩해줘", "수정해줘", or equivalent wording.
- If the user asks a direct question, answer the question first and do not make code changes unless implementation is also explicitly requested.
- Read `README.md`, this `AGENTS.md`, and the relevant `.docs/` file before making significant changes.
- When porting from V1, read the V1 source and V2 docs together; do not assume V1 structure is still valid in V2.
- Inspect existing code and package conventions before proposing new abstractions.
- Prefer existing patterns, local helpers, and package boundaries over new one-off structures.
- Keep edits scoped to the requested change.
- Do not refactor unrelated code while solving a narrow task.
- If user changes are present, preserve them and work with them.
- Do not revert files unless the user explicitly asks for it.
- Do not delete files unless the user explicitly requests it or the deletion is clearly part of the requested change.

## Source Editing Rules

- Treat all text files as UTF-8.
- Prefer patch-based edits for text changes.
- Avoid tools or commands that can rewrite Korean text as CP949/ANSI.
- When editing Korean text, prefer a Node.js script that reads and writes files with explicit UTF-8, using `fs.readFileSync(path, 'utf8')` and `fs.writeFileSync(path, next, 'utf8')`, instead of Windows PowerShell `Get-Content` / `Set-Content`.
- Do not pass long Korean document bodies through `powershell.exe -Command`; use a UTF-8-safe Node helper script or `apply_patch`.
- If a file contains Korean text, verify that no mojibake was introduced.
- Keep comments concise and useful.
- Do not add legal or copyright headers unless requested.

## New Source Files

When creating a new source-like file under this repository, add a short header comment if the file format supports comments.

The header should state:

- repository-relative file path
- purpose of the file
- creation date when useful
- optional **`@remark`** section for exports, function lists, usage notes, deprecations, or constraints that do not fit in `@description`

### `@remark` section

Add `@remark` when the file exposes multiple public symbols or non-obvious rules worth keeping at the top of the file.

- Place it after `@created` (or after `@description` when `@created` is omitted).
- Leave one blank JSDoc line before `@remark`.
- Keep it concise: bullet lists are preferred over long prose.
- List **public** exports (functions, types, constants). Omit private helpers unless they explain important behavior.
- Note deprecations, default locale/units, wire-format aliases, throw vs boolean semantics, and cross-file dependencies when useful.
- Update `@remark` when public exports or documented behavior change.

Examples:

```ts
/**
 * @file packages/ui/src/core/Button/Button.tsx
 * @description Primary button component for GenOffice V2.
 * @created 2026-06-22
 *
 * @remark
 * - Exports: Button, buttonVariants
 * - Uses theme tokens from @gen-office/theme; no hard-coded colors
 */
```

```ts
/**
 * @file packages/utils/src/format/date.ts
 * @description Date parse/format helpers for wire formats and ko-KR display.
 * @created 2026-06-23
 *
 * @remark
 * - Wire: parseDateString, formatDateString (DateWireFormat, DateYmdSeparator)
 * - Display: formatDateDisplay, formatDateTime, formatTime, formatRelativeTime
 * - iso date = parseDateString(value, 'ymd', '-')
 * - V1 names (parseApiDate, formatDate, …) remain as @deprecated aliases
 */
```

```css
/**
 * @file packages/theme/src/styles/global.css
 * @description Global CSS variables and base styles.
 * @created 2026-06-22
 *
 * @remark
 * - Loaded once by ThemeProvider
 * - CSS variables are the source of truth for color tokens
 */
```

```md
<!--
 @file packages/gen-datagrid/.docs/reference/api-structure.md
 @description Documents the public API grouping for GenDataGrid.

 @created 2026-06-22

 @remark
 - Gate docs live under packages/gen-datagrid/.docs/
 - Public API groups: core, selection, editing
-->
```

Do not add such headers to formats that do not support comments, such as JSON.

## GenDataGrid Rules

When touching `packages/gen-datagrid` (grid track):

- Follow the Gate and architecture docs under `packages/gen-datagrid/.docs/` (ported from or synced with V1).
- Preserve the div DOM contract: `data-gen-datagrid-root`, `data-grid-id`, `data-gen-datagrid-cell`.
- Do not introduce `<table>` rendering or V1 `gen-grid` selectors.
- Do not add a compatibility layer that maps GenGrid APIs to GenDataGrid.

## GenChart Rules

When touching `packages/gen-chart`:

- Follow [`.docs/05-GEN-CHART.md`](./.docs/05-GEN-CHART.md): headless `createGenChartModel` first, then composable React (`CartesianChart`, series slots).
- Do not copy V1 `packages/gen-chart/src/GenChart.tsx`.
- Do not expose a single monolith `GenChart` with `kind` discriminated union as the primary V2 API unless the user explicitly changes that decision in docs.

## GenDataGridCrud And Demo Layout Rules

When touching `packages/gen-datagrid-crud` or demo pages that use the grid:

- Preserve layout stability: flex height chains with `min-height: 0` where required.
- Do not force a default grid height in CRUD wrappers; consumers set height via grid props when needed.
- Keep action bars single-line unless a design explicitly requires wrapping.
- Horizontal overflow should scroll instead of clipping controls unexpectedly.

## Verification

Use the narrowest meaningful verification for the change.

When `.docs/06-BUILD_GUIDE.md` exists, use it for install, build, run, and troubleshooting. Until then, refer to [`.docs/README.md`](./.docs/README.md) and the V1 [`frontend/docs/01.BUILD_GUIDE.md`](../frontend/docs/01.BUILD_GUIDE.md) for command patterns, adjusting paths for the V2 workspace.

Common commands (after the monorepo scaffold exists):

```bash
pnpm install
pnpm build
pnpm lint
pnpm test
pnpm -C apps/demo build
pnpm -C packages/theme build
pnpm -C packages/ui build
pnpm -C packages/gen-datagrid build
pnpm -C packages/gen-datagrid exec tsc -p tsconfig.json --noEmit
pnpm check:encoding
```

If verification cannot be run, explain why in the final response.

## Pre-commit Guard

When `scripts/check-encoding.mjs` is present in this repository, the encoding guard can be run as:

```bash
node scripts/check-encoding.mjs --staged
```

The guard blocks:

- UTF-8 BOM
- invalid UTF-8
- replacement characters
- suspicious mojibake patterns in Korean text

Run the guard when editing Korean documentation or files that previously had encoding issues.
