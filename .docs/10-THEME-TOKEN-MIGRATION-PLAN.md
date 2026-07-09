<!--
 @file .docs/10-THEME-TOKEN-MIGRATION-PLAN.md
 @description theme 토큰 소유권 이전(패키지 내부화) 및 CSS 로드 컨벤션(B) 마이그레이션 계획.

 @created 2026-07-08
-->
# theme 토큰 마이그레이션 계획 — 패키지 내부 소유 + CSS 로드 컨벤션(B)

패키지 전용 디자인 토큰을 **각 패키지 내부에서 정의**하고, 전역 theme CSS는 **앱이 한 번만 로드**하는 구조로 전환하기 위한 진행 계획 문서입니다.

> 관련: [08-DESIGN-TOKENS-GUIDE.md](./08-DESIGN-TOKENS-GUIDE.md), [02-ARCHITECTURE.md](./02-ARCHITECTURE.md), [packages/theme/.docs/architecture.md](../packages/theme/.docs/architecture.md)

---

## 1. 배경 & 목표

- 현재 `packages/theme`는 `components/grid.css`에 그리드 전용 토큰(`--grid-*`)을 보유하지만, 이 토큰의 V2 런타임 소비처(`gen-grid`)는 **이 레포에 존재하지 않는다**(V1 유산).
- V2 코어 그리드 `gen-datagrid`는 theme와 **완전히 단절**되어 있고 `index.css`에 hex를 하드코딩한다(테마/다크 미지원).
- 패키지 전용 토큰은 **그 패키지 내부에서 정의**한다는 방침에 따라, theme의 그리드 토큰은 제거하고 `gen-datagrid`가 자체 토큰을 갖는다.
- 동시에, 라이브러리 패키지가 전역 theme CSS를 스스로 주입하는 현재 방식(A)을 **앱이 theme를 1회 로드하고 패키지는 토큰을 참조(+폴백)** 하는 방식(B)으로 수렴한다.

---

## 2. 확정 결정 (요약)

| # | 결정 | 비고 |
| --- | --- | --- |
| D1 | 패키지 전용 토큰은 **해당 패키지 내부**에서 정의 | 브랜드/중립 팔레트(base·semantic)는 theme 잔류 |
| D2 | theme `components/grid.css` **완전 삭제** (V1 하위호환·어댑터 금지) | V2 런타임 소비처 없음(검증됨) |
| D3 | `gen-datagrid`는 `--gen-datagrid-*` 토큰을 **내부 신규 정의** | V1 `--grid-*` 네이밍/값 승계 안 함 |
| D4 | 토큰 값 출처 = **Shell만** theme semantic 참조 + 폴백 (`var(--color-*, #hex)`); 하위는 `--gen-datagrid-*` 파생 | 2026-07-09 정제. 상세 §6.5 · design-tokens-architecture.md |
| D5 | CSS 로드 컨벤션 목표 = **B 방식** (앱이 로드, 패키지는 self-`@import` 없음) | gen-datagrid는 처음부터 B로 생성 |
| D6 | 기존 패키지(ui/mdi/gen-chart/gen-frame)의 A→B 전환은 **별도 작업으로 분리** | 그리드 트랙과 결합 금지 |

---

## 3. 현재 상태 스냅샷 (사실관계)

### 3.1 CSS 로드 방식 (`src/index.css`에서 theme self-`@import`)

| 패키지 | 현재 방식 | theme var 폴백 |
| --- | --- | --- |
| `ui` | A (self-import) | **없음** (다수 `var(--color-*)` 폴백 미기재) |
| `mdi` | A (self-import) | 확인 필요 |
| `gen-chart` | A (self-import) | 사실상 무관 (런타임 스타일 대부분 JS 토큰 hex, theme var는 `fontFamily` 1건·폴백 있음) |
| `gen-frame` | A (self-import) | 확인 필요 |
| `gen-datagrid` | **B** (`tokens.css`, self-import 없음) | Shell 브리지 + 폴백 hex. WS1.2에서 계층 재구조화 예정 |

- 앱은 theme를 로드함: `apps/demo/src/main.tsx`가 `@gen-office/theme/index.css` import, `apps/storybook`는 preview에서 로드.
- 따라서 목표(B)는 앱 전제 조건을 이미 만족한다.

### 3.2 theme `--grid-*` 참조처 (삭제 파급 범위)

전부 theme 내부 산출물 + 문서이며, **V2 런타임 코드 소비처는 0건**.

| 파일 | 처리 |
| --- | --- |
| `packages/theme/src/styles/tokens/components/grid.css` | **파일 삭제** |
| `packages/theme/src/styles/variables.css` (L8) | `@import './tokens/components/grid.css';` 제거 |
| `packages/theme/src/styles/tokens/theme-dark.css` (L41~123) | grid 다크 오버라이드 블록 제거 |
| `packages/theme/src/stories/Theme.stories.tsx` (L155~157) | Grid 스와치 3개 제거 |
| `packages/theme/test/cssTokens.test.ts` (L30) | `'components/grid.css'` 검증 항목 제거 |
| `.docs/08-DESIGN-TOKENS-GUIDE.md` | grid 토큰 언급을 "gen-datagrid 소유"로 갱신 |
| `packages/theme/.docs/ref/token-mapping.md` | grid 토큰 항목 정리(이관 표기) |

---

## 4. 목표 컨벤션 (B 방식) 정의

1. **전역 theme CSS 로드는 앱 책임.** 라이브러리 패키지의 `src/index.css`는 `@import '@gen-office/theme/index.css'`를 두지 않는다.
2. **패키지는 theme semantic 토큰을 참조**하되, 항상 **폴백 값**을 동반한다. 예: `color: var(--color-fg-secondary, #57606a);`
3. **패키지 전용 컴포넌트 토큰**은 패키지 내부에서 정의하고, 그 값이 브랜드/중립 팔레트에 해당하면 theme semantic을 참조한다.
4. 다크모드는 theme-dark가 semantic `--color-*`를 뒤집는 것으로 자동 반영된다. 패키지는 **자체 다크 오버라이드를 최소화**한다(진짜 패키지-전용 raw 값에만 필요).

---

## 5. 작업 분리 (2개 트랙)

| 워크스트림 | 트랙 | 범위 | 선행 조건 |
| --- | --- | --- | --- |
| **WS1** | 그리드 트랙 (지금) | gen-datagrid 토큰 내부화 + theme grid.css 삭제 | 없음 |
| **WS2** | 패키지 리뷰 트랙 (별도) | ui/mdi/gen-chart/gen-frame A→B 전환 | ui/mdi 폴백 보강 |

두 워크스트림은 독립 PR로 분리한다. WS1은 WS2에 의존하지 않는다(gen-datagrid는 처음부터 B).

---

## 6. WS1 — gen-datagrid 토큰 내부화 (그리드 트랙, 지금)

### 6.1 토큰 신설

- 위치: `packages/gen-datagrid/src/tokens.css`(신규) 또는 `index.css` 상단 `:root` 블록. (별도 파일 권장 — 오버라이드 지점 명확)
- 네임스페이스: `--gen-datagrid-*`.
- 값: `var(--color-*, <fallback hex>)` 형태(D4). 치수/높이 등 런타임 prop 주도 값은 기존 `--gen-datagrid-row-height` 등 유지.
- `index.css`는 theme를 `@import`하지 않는다(D5).

### 6.2 적용 가능성 매트릭스 (현재 datagrid 상태 → 처리)

**A군 — theme semantic로 매핑 가능(값·의미 일치):**

| datagrid 현재 | 참조 대상(semantic) |
| --- | --- |
| 셀 border `#d0d7de` | `--color-border-default` |
| 헤더 bg `#f6f8fa` | `--color-bg-tertiary` |
| 헤더 text `#24292f` | `--color-fg-primary` |
| 선택 셀 bg (accent 12%) | `color-mix(... var(--color-primary) ...)` |
| 핀 셀 bg `#ffffff` | `--color-bg-primary` |
| 시스템/번호/선택 fg `#57606a` | `--color-fg-secondary` |
| resize 핸들 | `--color-border` / `--color-fg-secondary` |
| placeholder skeleton | `--color-bg-tertiary` |

**B군 — 재조정 필요(값·의미 불일치):**

| 항목 | 조치 |
| --- | --- |
| 헤더 높이 | datagrid `--gen-datagrid-header-height`(prop) 유지, theme 고정값(44px) 미승계 |
| 헤더 font-weight (600 vs 500) | V2 값(600) 확정 |
| **updated 상태색** (amber vs theme의 파란 계열) | V2 dirty=amber 규칙 유지 → 자체 토큰 |
| current-row 하이라이트 (accent 7%) | hover와 의미 분리 → 자체 토큰 |
| 셀 padding | flex 고정높이 모델 유지(세로 padding 미사용) |
| z-index 스케일 | datagrid 자체 스케일 유지 |

**C군 — theme에 대응 없음 → `--gen-datagrid-*` 신규 정의 필수(V2 고유):**

- active-cell outline (색·두께)
- editing-cell / editor input border
- dirty cell inset bar + dirty row 그라디언트
- validation error / warning (inset shadow)
- visual-row-merge sticky label (bg tint · shadow · border)
- group header bg
- 컬럼 필터 UI (trigger/popover/input/clear, filter-active)
- global filter, pagination, footer row, footer bar
- detail toggle / tree toggle / detail panel
- reorder 핸들

> 신규 토큰 네이밍/값은 구현 착수 시 전수 표로 확정한다(상태색은 `--color-status-*` 참조 우선, V2 고유 규칙은 자체 값).

### 6.3 theme grid.css 삭제 + 내부 정리

§3.2의 7개 지점을 함께 처리. 삭제 순서는 "gen-datagrid 토큰 신설·치환 완료 → theme grid.css 제거"로 하여 중간 단계에서도 무결하게 유지.

### 6.4 WS1 태스크 체크리스트

- [x] gen-datagrid 토큰 전수 명세표 확정(A/B/C + 신규 네이밍·값·폴백) — 1차(팔레트형)
- [x] `packages/gen-datagrid/src/tokens.css` 작성
- [x] `index.css` hex → `var(--gen-datagrid-*)` 치환
- [x] 라이트/다크 시각 확인(데모)
- [x] theme grid.css 및 내부 5곳 + 문서 2곳 정리(§3.2)
- [x] 검증(§10) 및 로그(§11)

### 6.5 WS1.2 — gen-datagrid 토큰 계층 재구조화 (하이브리드, 후속)

WS1은 theme 연동·hex 제거를 달성했으나, 토큰 트리가 **팔레트(Foundation) 중심**이라 영역(Header/Body/Footer/System)·기능 분리가 불완전하다. AG Grid 영역 prefix + GenDataGrid DOM 구조 + feature 토큰 **하이브리드**로 재정의한다.

**정본:** [design-tokens-architecture.md](../packages/gen-datagrid/.docs/architecture/design-tokens-architecture.md) · [design-tokens-restructure-plan.md](../packages/gen-datagrid/.docs/plan/design-tokens-restructure-plan.md)

| 항목 | WS1 | WS1.2 |
| --- | --- | --- |
| 최상위 | `--gen-datagrid-color-*` (semantic 재수출) | **Shell** `--gen-datagrid-bg/border/text/accent` |
| theme semantic | 전 레이어 | **Shell만** `var(--color-*, #hex)` 브리지 |
| System | `--gen-datagrid-system-cell-*` | `system-header/body/footer-*` + 타입별 feature |
| Footer/Chrome | foundation 직접 참조 | `--gen-datagrid-footer-*`, `--gen-datagrid-chrome-*` |

**WS1.2 체크리스트**

- [x] 구조·계획 문서 작성 (architecture + plan 분리)
- [x] `src/styles/tokens.css` 계층 재작성 (`src/tokens.css`에서 이동)
- [x] `index.css` 영역 토큰 치환, `--gen-datagrid-color-*` 제거
- [x] gen-datagrid / gen-datagrid-crud 빌드 (데모 라이트/다크 육안은 수동)
### 6.6 WS1.3 — gen-datagrid-crud 토큰 정렬 (후속)

CRUD `index.css`가 theme semantic(`--color-*`)을 직접 참조하고 `--color-fg-default` 등 잘못된 이름을 사용한다. gen-datagrid Shell 파생 + `--gen-datagrid-crud-*`로 정렬한다.

**정본:** [packages/gen-datagrid-crud/.docs/architecture/design-tokens-architecture.md](../packages/gen-datagrid-crud/.docs/architecture/design-tokens-architecture.md) · [plan](../packages/gen-datagrid-crud/.docs/plan/design-tokens-restructure-plan.md)

**WS1.3 체크리스트**

- [x] 구조·계획 문서 작성
- [x] `src/styles/tokens.css` 신설
- [x] `index.css` theme 직참조 제거·보더 정리
- [x] crud build·vitest
- [ ] demo 라이트/다크 육안

---

## 7. WS2 — A→B 컨벤션 전환 (패키지 리뷰 트랙, 별도)

목표: `ui`·`mdi`·`gen-chart`·`gen-frame`의 self-`@import` 제거, 앱 로드 전제로 통일.

**선행 필수 — 폴백 보강:** `ui`(그리고 `mdi`)는 `var(--color-*)`를 폴백 없이 광범위하게 사용한다. self-import 제거 전, 최소한의 폴백 정책을 결정/적용해야 안전하다(미적용 시 theme 미로드 환경에서 무스타일).

### 7.1 WS2 태스크 체크리스트

- [ ] `ui`/`mdi`/`gen-frame` theme var 폴백 현황 조사
- [ ] 폴백 정책 결정(전수 폴백 vs 앱 로드 강제 + 가드)
- [ ] `gen-chart` self-`@import` 제거(저위험)
- [ ] `ui`/`mdi`/`gen-frame` self-`@import` 제거
- [ ] 통합 스토리북/데모 라이트·다크 회귀 확인
- [ ] `decisions.md` 컨벤션 결정 기록

---

## 8. 의존 & 순서

```text
WS1 (독립) ─┐
            ├─ 병렬 가능 (상호 비의존)
WS2 (독립) ─┘   단, WS2는 내부적으로 "폴백 보강 → self-import 제거" 순서 고정
```

- gen-datagrid는 WS2 완료 여부와 무관하게 B로 동작(앱이 theme 로드 시 테마·다크, 미로드 시 폴백).

---

## 9. 리스크 & 완화

| 리스크 | 영향 | 완화 |
| --- | --- | --- |
| theme grid.css 삭제 시 theme 테스트/스토리 깨짐 | theme 빌드·테스트 실패 | §3.2 내부 5곳 동시 정리 |
| WS2에서 ui/mdi 폴백 부재로 무스타일 | 격리 렌더 깨짐 | 폴백 보강 선행(하드 게이트) |
| A/B 혼재로 3번째 상태 발생 | 일관성 저하 | gen-datagrid를 목표 B로 생성, WS2를 명시적 후속으로 관리 |
| updated 상태색 등 의미 충돌 승계 | 잘못된 색 | B군 재조정 표로 명시 승계 차단 |

---

## 10. 검증

- `pnpm -C packages/theme test` (cssTokens 회귀 — grid 항목 제거 반영)
- `pnpm -C packages/gen-datagrid build` / `exec tsc -p tsconfig.json --noEmit`
- `pnpm -C apps/demo build`
- 통합 스토리북 라이트·다크 육안 확인
- `pnpm check:encoding`

---

## 11. 로그 / 문서 갱신 대상

- `.docs/logs/work-log.md` — 구현 착수 시 항목 추가(한국어, 역시간순)
- `.docs/logs/decisions.md` — D1~D6 결정 기록
- `packages/gen-datagrid/.docs/log/implementation-log.md` — 그리드 토큰 이전 상세
- `packages/theme/.docs/{architecture.md, ref/token-mapping.md}` — grid 토큰 제거 반영
- `.docs/08-DESIGN-TOKENS-GUIDE.md` — grid 토큰 소유권 이전 반영

---

## 12. 미결정 / 오픈 이슈

- ~~gen-datagrid 토큰 파일 배치~~ → **확정:** 별도 `tokens.css` (design-tokens-architecture.md §6)
- ~~C군 신규 토큰 최종 네이밍~~ → **WS1.2 정본:** design-tokens-architecture.md §4·§7. status 색은 feature literal(updated=amber).
- WS2 폴백 정책: 전수 폴백 vs "앱 theme 로드 강제 + 개발 가드"
- feature 전용 raw literal의 다크 대응: Shell 브리지로 대부분 해소; 잔여는 WS1.2 구현 시 검증
