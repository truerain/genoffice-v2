<!--
 @file packages/gen-frame/.docs/README.md
 @description Orientation for @gen-office/gen-frame package documentation.

 @created 2026-06-29

 @remark
 - Status: design / documentation phase (F0)
 - Related: apps/demo AppShell, packages/mdi
-->
# @gen-office/gen-frame 문서

GenOffice V2 **앱 프레임** 패키지입니다. 백오피스 앱의 레이아웃 chrome, 메뉴 표현, 페이지 오픈, URL 동기화를 **한 계약**으로 제공합니다.

## 왜 gen-frame인가

프레임워크 개발 과정에서 정리된 요구:

- **여러 layout showcase** — TitleBar / LeftPanel / (후속) hybrid·rail
- **MDI 선택적 사용** — 탭 모드 또는 단일 페이지 모드
- **URL ↔ Page 연동** — shell(프레임) 계층에서 오케스트레이션
- **앱 경계 유지** — 메뉴 API, registry, auth는 `apps/*` 책임

`gen-grid` · `gen-chart` · `gen-datagrid`와 네이밍 라인을 맞추기 위해 **`gen-frame`** 을 채택했습니다.

## 문서 목록

| 문서 | 내용 |
| --- | --- |
| [architecture.md](./architecture.md) | 패키지 역할·경계, 모듈 구조, Public API, 데이터 흐름 |
| [plan.md](./plan.md) | Phase F0~F5 구현 Plan, Gate, demo 연동 순서 |
| [implementation-log.md](./implementation-log.md) | 구현·설계 변경 이력 |

## 상위 문서

- [`.docs/02-ARCHITECTURE.md`](../../../.docs/02-ARCHITECTURE.md) — monorepo 패키지 경계
- [`.docs/06-PACKAGE-REVIEW-PLAN.md`](../../../.docs/06-PACKAGE-REVIEW-PLAN.md) — 패키지 검토 순서
- [apps/demo/.docs/architecture.md](../../../apps/demo/.docs/architecture.md) — reference 앱 배선

## 관련 패키지

| 패키지 | 관계 |
| --- | --- |
| `@gen-office/mdi` | **선택** 어댑터 — 탭 UI·상태 (gen-frame이 오케스트레이션) |
| `@gen-office/ui` | header 버튼, dropdown nav 등 |
| `@gen-office/theme` | CSS 토큰 |
| `apps/demo` | registry, menu API, auth — gen-frame **소비자** |
