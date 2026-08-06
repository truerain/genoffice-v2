<!--
 @file packages/debug/.docs/README.md
 @description Package documentation index for @gen-office/debug.

 @created 2026-08-06
-->
# @gen-office/debug

DEV 지향 상태·리렌더 관찰 훅 패키지입니다. V1 `@gen-office/debug` MVP를 V2로 이식했습니다.

## 책임

- `useDebugState` — 기존 값 변화 로그 (상태 소유 아님)
- `useRenderCount` — 렌더 횟수
- `useWhyRender` — deps bag shallow 변화 힌트
- `resolveDebugEnabled` — `enabled` / Vite `import.meta.env` 해석

## 비책임

- Dialog / overlay UI
- DataGrid 데이터셋 뷰어
- 그리드 CRUD 내부 디버그 훅
- `packages/utils`에 넣을 포맷·검증 유틸

## 의존

- peer: `react` / `react-dom` ^19
- `@gen-office/*` 런타임 의존 없음

## 문서

- [implementation-log.md](./implementation-log.md)
