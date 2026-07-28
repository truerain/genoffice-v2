<!--
 @file packages/gen-datagrid-pivot/.docs/implementation-plan.md
 @description Gate plan for implementing gen-datagrid-pivot without re-scoping.

 @created 2026-07-29

 @remark
 - 착수 시 Gate 순서대로 진행. 범위 변경은 decisions.md에 먼저 기록
-->
# Implementation Plan — gen-datagrid-pivot

## 착수 전제

- [decisions.md](./decisions.md) 잠금 준수
- Phase 4(chart/demo) 이후 또는 명시적 우선순위 상향 후에 소스 구현
- 본 `.docs`가 제품·구조 정본 — **추가 사전 검토 없이** 아래 Gate로 진행

## Gate 개요

| Gate | 목표 | 완료 기준 |
| --- | --- | --- |
| **P0** | 패키지 scaffold | `package.json`, vite/tsc, workspace 등록, export 스텁, Storybook 타이틀 자리 |
| **P1a** | 순수 엔진 | `buildPivotResult` + unit tests (sample fixture) green |
| **P1b** | Shell | `GenDataGridPivot` → GenDataGrid, Storybook, demo smoke |
| **P1c** | State·정렬·limits | serialize/restore, sort, `maxPivotColumns` truncate+warning |
| **P2** | Drill-through | 셀 → 원본 row 목록 (Dialog/`ui`) |
| **P3** | Pivot Panel | 허용 필드만 구성 UI |
| **P4** | Server contract | request/response types + adapter stub |
| **P5** | Chart (선택) | pivot 선택 → gen-chart |

**1차 출시 컷:** P0 + P1a + P1b + P1c.

---

## P0 — Scaffold

### 작업

1. `packages/gen-datagrid-pivot/package.json` — name `@gen-office/gen-datagrid-pivot`, deps: `gen-datagrid`, (peer) react
2. pnpm workspace / turbo pipeline에 등록 (`gen-datagrid-crud` 복제)
3. `src/index.ts` export 스텁
4. `implementation-log.md`에 P0 완료 기록

### 완료 기준

- [ ] `pnpm --dir packages/gen-datagrid-pivot build` 성공
- [ ] 앱에서 `import '@gen-office/gen-datagrid-pivot'` resolve

---

## P1a — Aggregation engine

### 작업

1. `engine/buildPivotResult.ts` 및 helpers ([package-design.md](./package-design.md) §4–7)
2. 픽스처: [fixtures/car_sales.sample.json](./fixtures/car_sales.sample.json)
3. 테스트 케이스 (최소):
   - rows=`REGION`, columns=`COLOR`, values=`sum(TOTAL)` → 열·셀 값
   - 다축 columns 조합
   - totals row/column/grand
   - `maxPivotColumns` truncate → `meta.truncated === true`
   - 빈 data / 빈 columns axis

### 완료 기준

- [ ] `pnpm --dir packages/gen-datagrid-pivot test` green
- [ ] React 없이 엔진만으로 결과 재현 가능

---

## P1b — GenDataGridPivot shell

### 작업

1. `GenDataGridPivot.tsx` — config+data → engine → `GenDataGrid`
2. read-only: editing / tree props 무시 또는 문서화된 충돌 시 console/dev warning
3. Storybook: Default, WithTotals, Truncated
4. demo 시연 페이지 1개 (선택: admin이 아닌 demo 라우트)

### 완료 기준

- [ ] Storybook에서 피벗 표 렌더·가로 스크롤
- [ ] nested header가 column axis를 반영

### 참고 패턴

- [gen-datagrid-crud package design](../../gen-datagrid-crud/.docs/gen-datagrid-crud-package-design.md) — `gridProps` thin shell

---

## P1c — State · sort · limits UX

### 작업

1. `serializePivotState` / `parsePivotState` — config 축·agg·totals·limits
2. 그룹 라벨 정렬, measure 열 정렬
3. truncate 시 `onPivotMetaChange` / UI 경고 (Story)

### 완료 기준

- [ ] state round-trip 테스트
- [ ] limits 스토리에서 truncated 표시

---

## P2 — Drill-through

### 작업

1. `drillMap`: cellKey → 원본 row 참조
2. 셀 더블클릭 또는 메뉴 → Dialog에 원본 목록 (read-only GenDataGrid 또는 테이블)
3. map은 엔진 재계산과 동기

### 완료 기준

- [ ] sample fixture에서 특정 집계 셀 → 기대 row 집합

---

## P3 — Pivot Panel

### 작업

1. 앱이 넘긴 `allowedFields`만 노출
2. rows / columns / values 배치 (체크 또는 단순 DnD)
3. `@gen-office/ui` 조합

### 완료 기준

- [ ] Panel로 config 변경 → 표 갱신 Story

---

## P4 — Server-side contract

### 작업

1. `PivotQuery` / `PivotResult` 타입 (AG Grid SSRM 개념 축소)
2. `buildPivotResult`와 동일 shape를 서버 응답이 채우는 adapter stub
3. 문서: 클라이언트 한계·권장 row 수

---

## P5 — Chart (선택)

- Phase 4 `gen-datagrid-chart` 이후
- 피벗 결과 선택 범위 → `CartesianChartOptions`

---

## 구현 체크리스트 (착수일 Day 0)

1. [ ] `decisions.md` + `package-design.md` + 본 문서 재확인 (변경 없으면 즉시 P0)
2. [ ] P0 scaffold
3. [ ] P1a TDD with `car_sales.sample.json`
4. [ ] P1b shell
5. [ ] P1c state
6. [ ] `.docs/logs` / package `implementation-log.md` 한국어 기록
7. [ ] (선택) `.docs/04-ROADMAP.md` 체크박스 갱신

## 리스크·완화

| 리스크 | 완화 |
| --- | --- |
| 결과 컬럼 폭발 | `maxPivotColumns`, Truncated 스토리 |
| tree/detail 충돌 | 상호배타 + shell에서 차단 |
| CRUD 혼동 | 읽기 전용·별도 화면 |
| 대용량 | P1 상한 문서, P4 |
| core 부족 | nested header·footer는 기존 API; grouping은 열지 않음 |
