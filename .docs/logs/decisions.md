# GenOffice V2 결정 로그

## 2026-06-23

### @gen-office/utils `cn` vs `clsx` 정책

- **`cn`:** V1 `ui`/`mdi` 이식 호환용으로 `@gen-office/utils`에 유지 (clsx thin wrapper).
- **V2 신규·수정:** className 병합은 각 패키지가 **`clsx` 직접 의존**해 사용. utils에 `cn` 확장·신규 export 하지 않음.
- ui 이식 완료 후 `cn` 모듈 제거 검토.

### @gen-office/theme 색상 토큰 정책

- **1층 팔레트:** CSS 변수가 유일한 source of truth. 색 값은 `#rrggbb` hex.
- **강조색(primary):** `#C6004D` (light `#FDE8EF`, dark hover `#9E003E` / dark mode accent dark `#EC008B`).
- **status:** Bootstrap 계열 유지 (`#28a745`, `#ffc107`, `#dc3545`, `#17a2b8`).
- **brand 토큰 제거:** `--color-brand` 삭제. `--button-brand-*`는 V1 ui 이식용으로 `--button-primary-*` alias만 유지.
- **JS 프리셋 제거:** `lightTheme` / `darkTheme` export 삭제. `useTheme()`만 런타임 JS API.
- **ChartTokens:** `@gen-office/theme`에서 제거. `@gen-office/gen-chart` 패키지에서 정의·소유.
- **Theme 타입:** `colors.brand` → `colors.primary` (`default` / `light` / `dark`).

관련 문서: `packages/theme/.docs/ref/token-sources-and-decisions.md`
