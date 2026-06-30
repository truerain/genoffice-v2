# @gen-office/demo

GenOffice V2 reference 백오피스 앱.

## 문서

- [`.docs/README.md`](./.docs/README.md) — 문서 목록·현재 상태
- [`.docs/architecture.md`](./.docs/architecture.md) — 아키텍처
- [`.docs/plan.md`](./.docs/plan.md) — 구현 Phase D0~D5

## 상태

**Gate D0 ✅ · D1 ✅ · D2 ✅ · D3 ✅ · D4 🔄** — UserManagement·Actuals `GenDataGridCrud` 연동. 나머지 admin: [plan.md](./.docs/plan.md#6-d4--admin-crud-진행-중).

## 실행

```bash
pnpm install
pnpm -C packages/theme build
pnpm -C packages/ui build
pnpm -C packages/mdi build
pnpm -C packages/gen-chart build
pnpm -C packages/gen-datagrid build
pnpm -C packages/gen-datagrid-crud build
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
