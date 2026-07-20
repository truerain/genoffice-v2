<!--
 @file apps/docs/.docs/implementation-log.md
 @description Implementation log for @gen-office/docs (public Docs site).

 @created 2026-07-13
-->
# @gen-office/docs 구현 로그

## 2026-07-13

### Docs Phase 재정리 (D0·D1·D1b 완료 → D2)

- **요약:** 진행 스냅샷 반영. D1b(IA 골격) 추가·완료. 다음 착수는 D2(GenFrame 제품 문서 + Grid Core 본문). D3 Patterns·D4 Vercel은 후속.
- **파일:** `apps/docs/.docs/plan/docs-site-plan.md` §6

### Left Panel IA 골격 (placeholder)

- **요약:** 계획 §3 IA를 사이드바 폴더로 고정. 본문은 Coming soon 스텁. Getting Started는 기존 페이지 유지.
- **파일:** `content/docs/{en,ko}/**/meta.json`, `products|grid-*|patterns|api|migration/**`, `scripts/scaffold-ia-skeleton.mjs`

### Quick Start — GenFrame 첫 앱 경로

- **요약:** Quick Start/홈/Installation을 GenFrame 셸 중심으로 재작성. `QuickStartApp` 라이브 예제. 그리드-only는 Key Features.
- **파일:** `content/docs/**/quick-start.mdx`, `src/examples/QuickStartApp.tsx`, `src/lib/gen-frame.ts`, `.docs/plan/docs-site-plan.md`

### React `<script>` 경고 — next-themes shim

- **요약:** client `next-themes` script 주입 제거. Turbopack/webpack alias → `next-themes-compat.tsx`, FOUC는 root layout Server `<head>` script.
- **파일:** `src/lib/next-themes-compat.tsx`, `src/app/layout.tsx`, `next.config.mjs`

### D1 — MVP 사이트 (한/영 + 라이브 예제) ✅

- **요약:** Fumadocs i18n(`en`/`ko`, dir parser). Getting Started 6페이지(en·ko) + QuickStart/Editable/Crud 라이브 예제. `pnpm -C apps/docs build` 통과.
- **파일:** `apps/docs/src/app/[lang]/**`, `content/docs/{en,ko}/**`, `src/examples/**`, `src/lib/i18n.ts`, `proxy.ts`, `package.json`

### D0 — Fumadocs 스캐폴드 ✅

- **요약:** §8 확정(한/영·외부·Vercel·Fumadocs·즉시 착수) 반영. `create-fumadocs-app` 템플릿(`+next+fuma-docs-mdx`)을 `apps/docs`에 병합. 패키지명 `@gen-office/docs`, 포트 3001, 랜딩·index MDX 브랜딩. `next build` 통과. i18n 라우트는 D1.
- **파일:** `apps/docs/package.json`, `src/**`, `content/docs/index.mdx`, `.docs/plan/docs-site-plan.md`, 루트 `package.json`(`docs` script), `pnpm-lock.yaml`
