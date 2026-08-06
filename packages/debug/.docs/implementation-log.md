<!--
 @file packages/debug/.docs/implementation-log.md
 @description Implementation log for @gen-office/debug.

 @created 2026-08-06
-->
# @gen-office/debug 구현 로그

역시간순.

## 2026-08-06

### V1 MVP 이식 (foundation)

- **요약:** V1 `@gen-office/debug` 훅 MVP를 V2로 이식. React 19 peer, `development` → src export 유지.
- **공개 API:** `resolveDebugEnabled`, `useDebugState`, `useRenderCount`, `useWhyRender`
- **제외:** Dialog UI, DataGrid 뷰어, CRUD 내부 디버그 (backlog)
- **파일:** `packages/debug/src/**`, `package.json`, `vite.config.ts`, README, `.docs/`
