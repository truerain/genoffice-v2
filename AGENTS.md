# GenOffice V2 Agent Rules

This file defines the working rules for AI coding agents in the GenOffice V2 (`genoffice-v2`) repository.

Use this file as the shared instruction source across Codex, ChatGPT, Claude, Gemini, Cursor, Copilot, and other coding agents. If another tool has its own instruction file, mirror the same project rules from this document instead of creating conflicting guidance.

## Repository Context

- This repository is **GenOffice V2**, a React-based framework for building enterprise back-office applications.
- V1 lives in the sibling workspace [`frontend`](../frontend). V2 replaces the V1 grid stack and rebuilds chart APIs; do not treat V1 as the target architecture for new work.
- The repository is a **pnpm monorepo** with apps under `apps/*` and reusable packages under `packages/*`.
- The package scope is `@gen-office/*`.
- The primary demo app is `apps/demo`.
- The integrated Storybook app is `apps/storybook`.
- Project-level design docs live under `.docs/`. Start with [`.docs/README.md`](./.docs/README.md).

## Work Split

Two tracks run in parallel:

| Track | Owner | Scope |
| --- | --- | --- |
| **Grid** | Grid track (V2 workspace) | `packages/gen-datagrid` Gate 0~9 ✅ · `gen-datagrid-crud` Gate 10~11 ✅ · demo D4 연동 진행 |
| **Package review** | Human-led review with agent help | All other packages and apps, bottom-up per [`.docs/06-PACKAGE-REVIEW-PLAN.md`](./.docs/06-PACKAGE-REVIEW-PLAN.md) |

When working in this repository:

- Do **not** add or restore V1 packages `gen-grid`, `gen-grid-crud`, or `gen-grid-chart`.
- Do **not** port V1 `GenChart.tsx` monolith into V2; follow [`.docs/05-GEN-CHART.md`](./.docs/05-GEN-CHART.md).
- Prefer the package review order: `tsconfig` → `theme` → `utils` → `ui` → `mdi` → `gen-chart` → … → apps.
- Touch `gen-datagrid-chart` or demo grid pages after confirming `gen-datagrid` public API for the target screen.

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
  - [`.docs/09-SOURCE-CONVENTIONS.md`](./.docs/09-SOURCE-CONVENTIONS.md) — source editing, file headers, encoding

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
- Read `README.md`, this `AGENTS.md`, [`.docs/09-SOURCE-CONVENTIONS.md`](./.docs/09-SOURCE-CONVENTIONS.md) (when editing source), and the relevant `.docs/` file before making significant changes.
- When porting from V1, read the V1 source and V2 docs together; do not assume V1 structure is still valid in V2.
- Inspect existing code and package conventions before proposing new abstractions.
- Prefer existing patterns, local helpers, and package boundaries over new one-off structures.
- Keep edits scoped to the requested change.
- Do not refactor unrelated code while solving a narrow task.
- If user changes are present, preserve them and work with them.
- Do not revert files unless the user explicitly asks for it.
- Do not delete files unless the user explicitly requests it or the deletion is clearly part of the requested change.

## Response Evaluation Rules

- Do not default to highlighting advantages when the user proposes an idea, asks whether an approach is good, or requests evaluation.
- Evaluate proposals neutrally by checking the goal, assumptions, constraints, risks, tradeoffs, alternatives, maintenance cost, package boundaries, and verification burden.
- Distinguish "possible" from "recommended". If something can be implemented but is not a good long-term direction, state that difference clearly.
- If an idea has benefits, mention them together with meaningful costs or risks instead of presenting only the favorable side.
- If a proposal is weak, risky, or misaligned with the repository direction, say so directly and explain the reason with a practical alternative.
- If there is not enough information to judge, state the missing assumptions or checks before agreeing with the proposal.


## Source Conventions

**정본:** [`.docs/09-SOURCE-CONVENTIONS.md`](./.docs/09-SOURCE-CONVENTIONS.md) — encoding, file headers, `@remark` / `@history`, change records.

Before editing source files, read that document. Summary for agents:

- All new source files: `@file`, `@description`, **`@remark`** (empty section allowed).
- Update `@remark` when public contract changes; use `@history` (3–5 lines max) for Gate-level changes.
- UTF-8 only; do not edit Korean bodies via PowerShell `Get-Content` / `Set-Content`.
- Log significant work in `.docs/logs/work-log.md` or package `implementation-log.md` (Korean).

## GenDataGrid Rules

When touching `packages/gen-datagrid` (grid track): see `packages/gen-datagrid/.docs/` and [09-SOURCE-CONVENTIONS.md §3](./.docs/09-SOURCE-CONVENTIONS.md#3-패키지도메인별-규칙).

- Preserve the div DOM contract: `data-gen-datagrid-root`, `data-grid-id`, `data-gen-datagrid-cell`.
- Do not introduce `<table>` rendering or V1 `gen-grid` selectors.
- Do not add a GenGrid → GenDataGrid compatibility adapter.

## GenChart Rules

When touching `packages/gen-chart`: [`.docs/05-GEN-CHART.md`](./.docs/05-GEN-CHART.md), `packages/gen-chart/.docs/`.

- Headless model first, then composable React; do not copy V1 `GenChart.tsx` monolith.

## GenDataGridCrud And Demo Layout Rules

When touching `packages/gen-datagrid-crud` or demo pages that use the grid:

- Flex height chains with `min-height: 0` where required.
- Do not force a default grid height in CRUD wrappers.
- Keep action bars single-line unless design requires wrapping.
- Horizontal overflow scrolls instead of clipping controls.

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

Encoding guard: [09-SOURCE-CONVENTIONS.md §1](./.docs/09-SOURCE-CONVENTIONS.md#1-인코딩편집-도구) (`node scripts/check-encoding.mjs --staged` when present).
