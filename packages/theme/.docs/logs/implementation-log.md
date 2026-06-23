<!--
 @file packages/theme/.docs/logs/implementation-log.md
 @description Package implementation and review change log for @gen-office/theme.

 @created 2026-06-22
-->
# Theme 구현 로그

## 2026-06-23

### architecture.md 토큰 정책·구조 전면 갱신

- 2026-06-23 색상 결정(hex primary, brand 제거, ChartTokens gen-chart 이전) 반영
- 디렉터리·Mermaid·exports·Theme 매핑표·테스트 목록 정리

### 색상 토큰 정책 반영 (결정 확정)

- CSS hex 통일, primary `#C6004D` / light `#FDE8EF` / dark `#9E003E`, Bootstrap status
- `--color-brand` 제거, `--button-brand-*` → primary alias (V1 ui 이식)
- `lightTheme`, `darkTheme`, `ChartTokens` 파일·export 제거
- `Theme.colors.brand` → `colors.primary` (`default` / `light` / `dark`)
- `ThemeProvider` 매핑 수정, grid `color-mix` → `--color-primary`
- Storybook ChartPalette 스토리 제거
- `.docs/logs/decisions.md`, `ref/token-sources-and-decisions.md` 갱신

### CSS·JS 토큰 정리 문서 추가

- `.docs/ref/token-sources-and-decisions.md` — CSS 토큰 / `useTheme` / JS 프리셋 관계, 불일치 사례, D1~D5 결정 항목
- `.docs/README.md` — 문서 목차에 링크 추가

### Storybook 타입 오류 수정

- `package.json` — `@storybook/react` devDependency 추가 (Storybook 10.4.6과 버전 맞춤)
- `vite.config.ts` — `vite-plugin-dts`에서 `src/stories/**` 제외 (lib `.d.ts` 오염 방지)
- `src/stories/Theme.stories.tsx` — `@gen-office/theme` self-import를 상대 경로로 변경, `StoryFn` 타입 명시

## 2026-06-22

### V1에서 V2로 수작업 소스이관

### Vitest 자동 테스트 추가

- `test/` — useTheme, ThemeProvider, themePresets, cssTokens (16 tests)
- `pnpm test` / `pnpm test:watch` 스크립트

### Storybook theme 스토리

- `src/stories/Theme.stories.tsx` — ModeAndContext, SemanticColors, ComponentTokens, ChartPalette, Typography
- `apps/storybook` — SB 10 addon 정리, preview에서 `index.css` + ThemeProvider

### 패키지 구조 문서 추가

- `.docs/architecture.md` — 디렉터리·토큰 계층·React 런타임·빌드 export (Mermaid 다이어그램)
- `.docs/README.md` — 패키지 문서 목차
- `ref/token-mapping.md` 파일 헤더 경로 정리

## 2026-06-15

### 로그 관리 시작

- 패키지 구현 로그를 생성했습니다.
- 앞으로 이 패키지의 소스, API, 동작, 문서 변경 사항은 이 파일에 기록합니다.
