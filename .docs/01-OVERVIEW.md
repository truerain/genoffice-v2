# GenOffice V2 개요

## 1. 프로젝트 정의

**GenOffice V2**는 기업용 백오피스 UI를 빠르게 구축하기 위한 React 기반 프론트엔드 프레임워크의 차세대 버전입니다.

V1([`frontend`](../../frontend))에서 축적한 UI, 테마, MDI, 차트, 데모 앱 인프라를 계승하되, **데이터 그리드 엔진을 `gen-datagrid`로 전면 교체**하고 table DOM 기반 레거시(`gen-grid` 계열)를 제거합니다.

```text
GenOffice V2 = V1 안정 자산 + gen-datagrid 엔진 + gen-datagrid-crud 신규
             + gen-chart 재설계 − gen-grid/gen-chart(V1) 레거시
```

그리드와 마찬가지로 **차트도 V1 `GenChart` monolith 구현을 이식하지 않습니다.** API·headless 모델을 먼저 고정하고 visx composable 렌더러를 새로 구현합니다. 상세는 [05-GEN-CHART.md](./05-GEN-CHART.md)를 참고하세요.

## 2. 왜 V2를 만드는가

### V1에서 확인된 한계

V1의 `@gen-office/gen-grid`는 TanStack Table 위에 `<table>` DOM으로 구현되어 있습니다. 운영하면서 아래 구조적 제약이 드러났습니다.

- `td[data-rowid][data-colid]` selector와 `document.querySelector` 기반 cell focus
- `GenGridBody` / `GenGridVirtualBody` 렌더링 로직 중복
- native `colSpan` / `rowSpan` 의존으로 div 기반 확장이 어려움
- grid in grid, master-detail, nested grid range selection 등 후속 요구에 table DOM이 걸림돌

### V2가 해결하려는 것

[`gen-datagrid`](../packages/gen-datagrid)는 위 한계를 전제로 **처음부터 div `role="grid"` 기반**으로 설계·구현되었습니다.

- TanStack Table의 column/row/sort/filter/pin 상태 모델은 유지
- DOM은 `data-gen-datagrid-*` 계약으로 grid instance 단위 격리
- selection, editing, clipboard, virtualization을 동일 아키텍처 위에서 확장
- `gen-grid` API와 1:1 호환을 목표로 하지 않음 (의도적 breaking change)

### V1 GenChart의 한계

V1 `@gen-office/gen-chart`는 visx 전환 과정에서 **급히 구현**되었습니다.

- [`api-draft.md`](../../frontend/docs/gen-chart/api-draft.md)의 composable·headless 설계와 실제 `GenChart.tsx` monolith API가 불일치
- `createGenChartModel`의 `getNearestDatum`, series visibility 등 headless 계약 미완
- ~1,700줄 단일 파일에 렌더링·축·tooltip·legend가 집중
- gen-datagrid 대비 테스트·gate 체계 부족

V2는 V1 차트 **코드를 복사하지 않고**, demo 시나리오만 수용 기준으로 삼아 API부터 다시 만듭니다.

## 3. 목표

### 제품 목표

- 백오피스 화면의 80% 이상을 패키지 조합으로 빠르게 구성
- MDI + DB 메뉴 + 세션 인증 + CRUD 그리드 패턴을 reference demo로 제공
- AI 코딩 도구와 함께 개발·유지보수하기 쉬운 패키지 경계 유지

### 기술 목표

- `gen-datagrid`를 유일한 그리드 엔진으로 확정
- `gen-datagrid-crud`로 admin CRUD 패턴 표준화
- `gen-chart`를 headless composable API로 재설계·구현
- V1 demo 화면을 GenDataGrid / 새 GenChart API 기준으로 재현
- 빌드·타입체크·interaction test·Storybook으로 품질 게이트 유지

### 비목표 (V2 초기)

- `gen-grid` API 호환 레이어 제공
- V1 `GenChart` props·monolith API 호환
- tree row + row merge 동시 지원
- server pagination/filtering 고도화 (MVP 이후)
- backend API 스키마 변경
- React 19 / Storybook 9를 Day-1 필수 조건으로 삼지 않음

## 4. 범위

### 포함

| 영역 | 내용 |
| --- | --- |
| 기반 패키지 | `theme`, `ui`, `utils`, `mdi`, `tsconfig` |
| 핵심 그리드 | `gen-datagrid` (V2 workspace 이관 · Gate 0~9 ✅) |
| 차트 | `gen-chart` (V2 신규 설계·구현, V1 코드 이식 안 함) |
| CRUD 레이어 | `gen-datagrid-crud` (Gate 10~11 ✅, demo D4 연동 진행 중) |
| 차트 연동 | `gen-datagrid-chart` (새 GenChart API 기준) |
| 앱 | `demo`, `storybook` |
| 백엔드 연동 | 기존 [`backend`](../../backend) API 재사용 |

### 제외

| 영역 | 이유 |
| --- | --- |
| `gen-grid` | V2 그리드 엔진으로 대체 |
| `gen-grid-crud` | `gen-datagrid-crud`로 대체 |
| `gen-grid-chart` | gen-datagrid + 새 gen-chart 기준으로 재구성 |
| V1 `gen-chart` 구현 (`GenChart.tsx` monolith) | API·구조 부채. V2에서 이식하지 않음 |
| `gen-datagrid`의 "experimental" 위치 | V2에서는 정식 core 패키지 |

## 5. 이해관계자·사용 시나리오

### 프레임워크 개발자

- 패키지 API, Storybook, Gate 테스트로 그리드·UI 품질 관리
- `.docs/`와 패키지 `.docs/` 설계 문서로 breaking change 추적

### 백오피스 화면 개발자

- `demo` 앱 패턴(CRUD config, column helper, MDI 페이지 등록)을 복제
- `@gen-office/gen-datagrid` + `@gen-office/gen-datagrid-crud` 조합으로 화면 구성

### AI 코딩 에이전트

- 루트 `AGENTS.md`(이식 예정)와 패키지 경계 규칙 준수
- V1 `gen-grid` / V1 `GenChart` 예제를 그대로 생성하지 않고 V2 API 사용

## 6. 현재 진행 상황 (2026-06-29)

### `@gen-office/gen-datagrid` (V2 workspace)

div renderer MVP 표면과 Gate 9 handle API까지 구현·테스트 완료.

| Gate | 내용 | V2 상태 |
| --- | --- | --- |
| 0~8 | div contract, keyboard, selection, editing, pinning, filter/footer, virtualization, master-detail/tree/merge 등 MVP | ✅ |
| 9 | `GenDataGridHandle` — `getData`, `getChangeSet`, `acceptChanges`, `flushEditing` 등 | ✅ |

검증: `pnpm -C packages/gen-datagrid test` (baseline 17 + interaction 181).  
정본: [packages/gen-datagrid/.docs/README.md](../packages/gen-datagrid/.docs/README.md), [remaining-work-plan.md](../packages/gen-datagrid/.docs/plan/remaining-work-plan.md)

### `@gen-office/gen-datagrid-crud` (V2 workspace)

| Gate | 내용 | V2 상태 |
| --- | --- | --- |
| 10 | `GenDataGridCrud` thin shell, ActionBar, controller | ✅ |
| 11 | created row, validation, commit pipeline, export shell | ✅ |
| 12 | migration guide, app QA guide | ✅ (문서) |

demo `ActualsPage`·`UserManagement` 이관 ✅ — 나머지 admin 화면 진행 중 (Gate 12 app slice 1차).  
정본: [packages/gen-datagrid-crud/.docs/README.md](../packages/gen-datagrid-crud/.docs/README.md)

### V2 워크스페이스 기타

| 트랙 | 상태 |
| --- | --- |
| **기반 패키지** | `theme`, `utils`, `ui`, `mdi` 검토·이식 ✅ |
| **gen-chart** | Phase 1 (C0~C7) ✅ · demo Chart/Dashboard ✅ |
| **gen-frame** | F0~F5 ✅ · demo MDI shell ✅ |
| **apps/demo** | D0~D3 ✅ · D4 admin CRUD **진행 중** |
| **gen-datagrid-chart** | 미착수 |

## 7. MVP 완료 정의

V2를 "1.0 MVP"로 볼 수 있는 조건입니다.

### 필수

- [x] 워크스페이스에 `gen-grid` 계열 패키지 없음 · `gen-datagrid` 존재
- [ ] `pnpm build`, `pnpm lint`, `pnpm test` 전체 통과 (monorepo 일괄)
- [x] `gen-datagrid` Gate 0~8 MVP + Gate 9 handle API
- [x] `gen-datagrid-crud` Gate 10~11 (CRUD toolbar·save/validation shell)
- [ ] demo: 로그인 → MDI → 메뉴 5종 이상 GenDataGrid 화면 동작
- [x] `gen-chart` Chart/Dashboard demo composable API 재현
- [ ] mock 모드 및 실 backend 연동 (admin CRUD 포함)

### 권장

- [ ] Storybook에 gen-datagrid 핵심 시나리오 정리
- [ ] `html-editor` 패키지 분리 검토 (TipTap을 `ui`에서 분리)
- [ ] Playwright 또는 Storybook test runner로 browser E2E 기반 마련

## 8. 성공 지표

| 지표 | 설명 |
| --- | --- |
| 그리드 단일화 | demo·패키지 전체가 `gen-datagrid`만 사용 |
| 차트 재설계 | V1 monolith `GenChart` 없음. headless composable API만 사용 |
| 화면 재현율 | V1 admin + Chart/Dashboard + Actuals 핵심 시나리오 동작 |
| 테스트 | interaction test + build gate 유지 |
| 문서 | V2 `.docs/`와 패키지 `.docs/`가 구현과 일치 |
| V1 freeze | MVP 이후 신규 기능은 V2에만 추가 |

## 9. 관련 문서

- [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) — 구조·패키지 책임
- [03-V1-RELATIONSHIP.md](./03-V1-RELATIONSHIP.md) — V1 이식·제외 매트릭스
- [04-ROADMAP.md](./04-ROADMAP.md) — 단계별 실행 계획
- [05-GEN-CHART.md](./05-GEN-CHART.md) — GenChart V2 재설계
- [06-PACKAGE-REVIEW-PLAN.md](./06-PACKAGE-REVIEW-PLAN.md) — 패키지 소스 검토 순서
