<!--
 @file .docs/logs/work-log.md
 @description Repository-level implementation work log for GenOffice V2.

 @created 2026-06-23
-->
# GenOffice V2 작업 로그

## 2026-06-23

### @gen-office/ui Separator core 이식 정리

- 헤더·스토리 taxonomy·`packages/ui/.docs/core/separator.md`

### @gen-office/ui Label core 이식 정리

- ref 타입·스토리 의존성 수정, `packages/ui/.docs/core/label.md` 추가

### Storybook 사이드바 — Theme 맨 아래 정렬

- `storySort.order: ['UI', '*', 'Theme']`; Theme stories `title: 'Theme/Theme'` (단일 레벨 root는 sort 미적용)

### 디자이너·퍼블리셔용 디자인 토큰 가이드

- `.docs/08-DESIGN-TOKENS-GUIDE.md` — 색상 추가·변경 절차, 역할별 온보딩, 체크리스트
- `.docs/README.md`, `packages/theme/.docs/README.md` 링크 추가

### Button `brand` variant·토큰 전면 제거

- theme: `--button-brand-*` 삭제 (`button.css`)
- ui: `ButtonVariant`에서 `brand` 제거, `.brand` CSS·스토리 삭제
- `cssTokens.test.ts`: `--button-brand` 부재 assert 추가

### @gen-office/theme primary near-black (#171717)

- 마젠타 primary 폐기 → near-black CTA; danger Bootstrap red와 시각 분리
- `base.css`, `theme-dark.css`, `button.css`, 테스트·문서 갱신

### @gen-office/ui 이관 Plan·아키텍처 문서

- `packages/ui/.docs/architecture.md` — Radix 래퍼, clsx, Vitest + Storybook Gate
- `packages/ui/.docs/migration-plan.md` — Wave 0~5, core 우선 이관 순서
- 다음 구현: Wave 0 스캐폴드 → Button 첫 Gate

### @gen-office/ui package.json React 19·V2 스택 정렬

- V1(React 18 / Storybook 8) → V2 monorepo 기준: React 19.2.7, Storybook 10.4.6, Vite 6.4.3
- SB8 전용 패키지 제거(`addon-essentials`, `blocks`, `core` 등), `addon-docs` 추가
- `peerDependencies`: `react`/`react-dom` `^19.0.0` (`theme`와 동일)

### @gen-office/utils 패키지 검토 마무리

- review-log 종료 표시, 다음 순서 `ui`
- 최종: 57 tests, V2 date/normalize API, V1 compat 분리, `cn`/clsx 정책 확정

### @gen-office/utils `cn` / `clsx` 정책

- `cn` V1 호환 유지, V2 신규 패키지는 `clsx` 직접 사용 — decisions.md·utils README 반영

### @gen-office/utils 패키지 검토 완료

- devDeps 정리, review-log, README, Y/N helper, normalize.v1, 테스트·migration 문서
- `packages/utils/.docs/review-log.md` — Gate 완료

### @gen-office/utils format/date V1 alias 분리

- `format/date.v1.ts` — V1 deprecated alias, `date.ts`는 V2 API 전용

### AGENTS.md `@remark` 파일 헤더 규칙

- 소스 파일 헤더에 `@remark` 섹션 추가 가능 (함수 목록·deprecation·제약 등)
- `packages/utils/src/**` 11개 파일에 즉시 적용

### @gen-office/utils format/date API 통합

- `parseDateString` / `formatDateString` — `yyyymmdd`, `yyyymm`, `ymd`+구분자
- `formatDateDisplay` — ko-KR UI 표시, V1 이름은 deprecated alias
- 변경: `packages/utils/src/format/date.ts`, 테스트·`.docs/README.md`

### utils 패키지 가이드 문서

- `packages/utils/.docs/README.md` — API·우선 사용 원칙 (루트 README 대신 패키지 가이드)
- 루트 `README.md` utils 섹션 변경 취소

### @gen-office/utils V1 이식 점검

- 파일 헤더 추가, vite/vitest 설정 수정, `parseApiDate` 버그 수정
- `normalizeUseYnWithDefault` — `normalizeUseYn` 호출로 수정
- `packages/utils/.docs/implementation-log.md` 생성

### @gen-office/theme 색상 토큰 정책 반영

- 1층 CSS 팔레트 hex 통일, primary `#C6004D`, Bootstrap status, brand 제거
- `lightTheme`/`darkTheme`/`ChartTokens` JS export 제거, `Theme.colors.primary`로 정리
- `ThemeProvider` CSS 변수 매핑 수정, grid `color-mix`가 `--color-primary` 참조
- 결정 로그: `.docs/logs/decisions.md`
- 변경 파일: `packages/theme/src/styles/tokens/*`, `provider/ThemeProvider.tsx`, `types/theme.types.ts`, 테스트·스토리·문서
