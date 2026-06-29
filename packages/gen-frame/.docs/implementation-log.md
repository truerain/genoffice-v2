<!--
 @file packages/gen-frame/.docs/implementation-log.md
 @description Implementation and design change log for @gen-office/gen-frame.

 @created 2026-06-29

 @remark
-->
# @gen-office/gen-frame 구현 로그

## 2026-06-29

### F0 — 패키지 설계·문서 scaffold

- **요약:** `@gen-office/gen-frame` 패키지 디렉터리 및 설계 문서 초안
- **배경:** framework showcase — 다중 layout, MDI/비MDI, URL 연동을 앱 shell 계층에서 오케스트레이션
- **결정:** 패키지명 `gen-frame` (`gen-grid` / `gen-chart` 라인업); `mdi`는 optional peer
- **문서:** `architecture.md`, `plan.md` (Phase F0~F5)
- **다음:** F1 — `WorkspaceFrame` + `leftPanel` Storybook
