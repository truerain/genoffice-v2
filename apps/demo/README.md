# @gen-office/demo

GenOffice V2 reference 백오피스 앱.

## 문서

- [`.docs/README.md`](./.docs/README.md) — 문서 목록·현재 상태
- [`.docs/architecture.md`](./.docs/architecture.md) — 아키텍처
- [`.docs/plan.md`](./.docs/plan.md) — 구현 Phase D0~D5

## 상태

**Gate D0 ✅** — Vite scaffold, `ThemeProvider`, placeholder `App`. 다음: [D1 shell + MDI](./.docs/plan.md#3-d1--app-shell--mdi).

## 실행

```bash
pnpm install
pnpm -C packages/theme build
pnpm -C apps/demo dev
```

빌드:

```bash
pnpm -C apps/demo build
```

루트:

```bash
pnpm dev
```
