<!--
 @file apps/demo/.docs/guide/ui-direction.md
 @description Soft Modern UI direction for @gen-office/demo.

 @created 2026-06-29

 @remark
 - Demo-scoped visual system; theme/ui/mdi 패키지 변경 없음
 - 구현: src/styles/app-shell.css, shared/components/DemoSurface
 - 네이밍: [app-styles-naming.md](./app-styles-naming.md)
-->
# Demo UI 방향 — Soft Modern

백오피스 reference 앱에 **부드럽고 통일된 제품감**을 주는 demo 전용 시각 규칙입니다.  
글래스모피즘(blur)은 사용하지 않고, **workarea 틴트 + elevation + 공통 Surface**로 계층을 만듭니다.

## 1. 원칙

| 원칙 | 내용 |
| --- | --- |
| 범위 | `apps/demo`만. `@gen-office/theme` 토큰을 **참조**하되 패키지 수정 없음 |
| 데이터 우선 | 차트·그리드 영역은 blur·강한 장식 없이 가독성 유지 |
| 계층 3단 | Chrome → Workarea → Elevated Surface |
| 토큰 정렬 | 비공식 `--color-surface-default` 등 제거, theme semantic + `--app-*` alias |

## 2. 레이어 정의

```text
┌─────────────────────────────────────────────┐
│ Chrome — header, sidebar                    │  흰/표면 + 얕은 shadow
├──────────┬──────────────────────────────────┤
│ sidebar  │ Workarea — MDI 탭 패널 배경       │  --app-workarea-bg (틴트)
│          │  ┌────────────────────────────┐  │
│          │  │ Elevated Surface — 카드     │  │  --app-surface-bg + shadow-sm
│          │  └────────────────────────────┘  │
└──────────┴──────────────────────────────────┘
```

## 3. App shell 토큰 (`app-shell.css`)

| 토큰 | light | dark |
| --- | --- | --- |
| `--app-workarea-bg` | `--color-workarea` | `--color-background` |
| `--app-surface-bg` | `--color-background` | `--color-surface` |
| `--app-chrome-bg` | `--color-background` | `--color-background` |
| `--app-radius-sm` | `--border-radius-md` (8px) | 동일 |
| `--app-radius-md` | `--border-radius-lg` (12px) | 동일 |
| `--app-shadow-elevated` | `--shadow-sm` | 어두운 shadow 오버라이드 |
| `--app-shadow-chrome` | `--shadow-sm` | 동일 |

Workarea는 `AppShell`의 `main[data-app-workarea]`에서 `--color-bg-primary`를 `--app-workarea-bg`로 스코프 오버라이드합니다.

## 4. 공통 컴포넌트

### `DemoSurface`

| variant | 용도 |
| --- | --- |
| `elevated` | 대시보드 카드, 차트 프레임, 로그인 카드 |
| `chrome` | (예비) chrome 패널 — 현재는 CSS Module에서 직접 적용 |
| `flat` | border·shadow 없는 래퍼 |

### 기존 레이아웃

- `AdminPageLayout` + `PageHeader` — 페이지 골격 유지, 간격·구분선만 Soft Modern에 맞게 조정
- `DashboardChartCard`, `DemoChartSection` — 내부를 `DemoSurface`로 통일

## 5. 적용 파일

| 영역 | 파일 |
| --- | --- |
| 토큰 | `src/styles/app-shell.css` |
| Surface | `src/shared/components/DemoSurface/*` |
| Shell | `AppShell.module.css`, `MenuSidebar.module.css` |
| 로그인 | `LoginPage.tsx`, `LoginPage.module.css` |
| 페이지 | `PageHeader`, `AdminPageLayout`, chart/dashboard 카드·섹션 |

## 6. 향후 (D4+)

- Admin CRUD 페이지도 `DemoSurface` / `PageHeader` 패턴 재사용
- 제품 전체 표준화 시 `packages/theme`에 `--surface-elevated` 등 승격 검토
- MDI 탭 바 스타일은 `mdi` 패키지 소유 — demo에서 workarea만 틴트 처리

## 7. 하지 않는 것

- `backdrop-filter` / 글래스모피즘
- theme primary(`#171717`) 정책 변경
- `ui` / `mdi` 패키지 전역 스타일 개편
