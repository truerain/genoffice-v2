<!--
 @file packages/gen-chart/.docs/architecture/design-tokens-architecture.md
 @description GenChart 디자인 토큰·theme 연동 구조 정본 (ChartTokens + CSS chrome).

 @created 2026-07-09
-->
# GenChart 디자인 토큰 아키텍처

`@gen-office/gen-chart`의 **ChartTokens**, **CSS chrome**, **theme·앱 연동** 규칙을 정의한다. gen-datagrid와 **같은 V2 원칙**, **다른 구현 매체**(TS preset + SVG inline + 일부 CSS)를 따른다.

> **상태:** 설계 정본 (2026-07-09). 코드는 Phase 1 MVP — `lightChartTokens`/`darkChartTokens` hex preset, `index.css` theme self-import, demo ThemeProvider 미연동.
>
> 관련: [architecture.md](../architecture.md) · [.docs/05-GEN-CHART.md](../../../../.docs/05-GEN-CHART.md) · [.docs/08-DESIGN-TOKENS-GUIDE.md](../../../../.docs/08-DESIGN-TOKENS-GUIDE.md) · [gen-datagrid design-tokens-architecture.md](../../gen-datagrid/.docs/architecture/design-tokens-architecture.md) · [decisions.md D4/D5](../../../../.docs/logs/decisions.md)

---

## 1. gen-datagrid와의 관계

### 1.1 공통 (V2 원칙 — 동일)

| 원칙 | gen-datagrid | gen-chart |
| --- | --- | --- |
| 토큰 소유 | 패키지 (`--gen-datagrid-*`) | 패키지 (`ChartTokens`) |
| theme 역할 | semantic 브랜드·다크 **원천** | **동일** (직접 소유 아님) |
| theme self-import | **금지** (B convention) | **목표 동일** (현재 `index.css`는 미적용) |
| 앱 override | CSS `datagrid-overrides.css` 등 | `options.tokens` + (선택) CSS chrome |
| 패키지 경계 | theme에 grid.css 없음 | theme에서 ChartTokens **제거됨** (D4) |

### 1.2 다름 (구현 — 의도적)

| | gen-datagrid | gen-chart |
| --- | --- | --- |
| **매체** | CSS custom properties | **TypeScript 객체** + SVG attribute / inline style |
| **이유** | div 셀·대량 DOM, cascade | visx SVG `stroke`/`fill`, `seriesPalette[]`, headless core |
| **색 전달** | `--gen-datagrid-body-cell-bg` | `tokens.color.background` |
| **dark** | theme cascade → Shell 브리지 | `ChartTheme` preset + 앱 **연동** (TODO) |

**하지 않는 것:** gen-datagrid의 `styles/tokens.css` 전체 구조를 chart에 **복제**하지 않는다.

---

## 2. 토큰 모델 (ChartTokens)

정본 타입: `packages/gen-chart/src/types/tokens.ts`

```text
ChartTokens
├── color        ← plot·axis·grid·tooltip·legend·seriesPalette
├── typography   ← fontFamily (CSS var 허용), axis/legend/tooltip sizes
├── spacing      ← plot padding, legend gap, tooltip padding (px)
├── border       ← stroke width, tooltip radius, grid/axis width
└── motion       ← enabled, durationMs, easing (lifecycle C6b)
```

해석 API: `resolveChartTokens(theme?, tokens?)` — `light` | `dark` preset + `DeepPartial<ChartTokens>` merge.

소스 파일:

```text
packages/gen-chart/src/themes/
  lightChartTokens.ts
  darkChartTokens.ts
  resolveChartTokens.ts
```

Context: `ChartRoot` / polar root → `ChartContext` → series, axis, legend, tooltip.

---

## 3. 렌더링 채널 (이중)

```text
┌─ ChartTokens (TS) ─────────────────────────────────────┐
│  CartesianPlot / PolarPlot  → SVG bg, grid, axis, series │
│  ChartLegend / ChartTooltip → HTML inline style (색·font) │
└──────────────────────────────────────────────────────────┘
┌─ index.css ────────────────────────────────────────────┐
│  .gen-chart-root, -legend, -tooltip  → layout, hover     │
│  .gen-chart-motion-*                 → keyframes         │
│  --gen-chart-motion-duration/easing  → motion (CSS var)  │
└──────────────────────────────────────────────────────────┘
```

| UI | 색·타이포 | 레이아웃·motion |
| --- | --- | --- |
| SVG plot / axis / grid / series | **ChartTokens** | — |
| HTML legend / tooltip | **ChartTokens** → inline | **index.css** class |
| Enter animation | tokens.motion → CSS var | **index.css** keyframes |

---

## 4. ChartTokens 명세 (현재 preset)

### 4.1 color

| 필드 | 용도 |
| --- | --- |
| `background` | plot SVG 배경 |
| `textPrimary`, `textMuted` | (reserved / 보조) |
| `axis`, `grid`, `crosshair` | 축·그리드·십자선 |
| `tooltipBg`, `tooltipBorder`, `tooltipText` | HTML tooltip |
| `legendText`, `legendTextMuted` | HTML legend |
| `seriesPalette` | 시리즈 순환색 (string[]) |

### 4.2 typography

| 필드 | 비고 |
| --- | --- |
| `fontFamily` | `var(--font-family-primary, system-ui, …)` — **theme 연동 유일 지점** |
| `axisTickFontSize`, `legendFontSize`, `tooltipFontSize` | px |

### 4.3 spacing · border · motion

`computePlotArea`·legend reserve·tooltip padding·stroke width·`motion.durationMs` 등 layout/연출 치수. 상세는 타입 정의를 본다.

---

## 5. theme 연동 (목표)

### 5.1 D4 · B convention

| 규칙 | 내용 |
| --- | --- |
| ChartTokens **소유** | `gen-chart/themes` (theme 패키지 아님) |
| CSS 로드 | 앱이 `@gen-office/theme/index.css` **1회**; chart `index.css`는 theme **self-import 제거** (목표) |
| 브리지 | preset **문자열**에 `var(--color-*, #hex)` 사용 가능 (CSS var는 SVG/HTML style 값으로 전달) |

### 5.2 gen-datagrid Shell 브리지와의 대응

| gen-datagrid Shell | chart preset (목표 매핑 예) |
| --- | --- |
| `--gen-datagrid-bg` | `color.background` → `var(--color-bg-primary, …)` |
| `--gen-datagrid-text` | `color.axis`, legend/tooltip text |
| `--gen-datagrid-border` | `color.grid`, `tooltipBorder` |
| `--gen-datagrid-accent` | `seriesPalette[0]` 또는 accent 파생 |
| `--gen-datagrid-text-muted` | `color.textMuted`, `legendTextMuted` |

**1차 구현(Phase 1):** hex literal preset — **브리지 미적용**.  
**후속:** light/dark preset 값을 semantic `var()` 문자열로 **점진 치환** (grid WS와 별 트랙).

### 5.3 ChartTheme vs ThemeProvider

| | `ChartTheme` (`'light' \| 'dark'`) | 앱 `ThemeProvider` |
| --- | --- | --- |
| 역할 | chart **preset 선택** | 앱 전역 light/dark |
| 목표 | **동기화** — 앱 mode → `options.theme` | demo 등에서 wiring |
| 현재 | demo 미연동 → 항상 light preset | — |

---

## 6. 토큰 없음 — CSS만 (chrome)

`index.css`에 하드코딩. 앱은 **선택자 override** (향후 `chart-overrides.css`).

| 대상 | 내용 |
| --- | --- |
| `.gen-chart-tooltip` | `box-shadow: 0 4px 12px …` |
| `.gen-chart-legend-item:hover` | `color-mix(…, currentColor 6%, …)` |
| motion keyframes | line/bar/area/pie enter |

점진적으로 `--gen-chart-chrome-*` CSS 변수 도입 가능 (grid의 pinned shadow 토큰화와 동일한 **선택** 과제).

---

## 7. 소비자 오버라이드

### 7.1 Plot·axis·series·legend·tooltip 색 (권장)

```tsx
<ChartRoot
  options={{
    theme: 'dark',
    tokens: {
      color: {
        background: 'var(--color-bg-primary, #ffffff)',
        seriesPalette: ['#2563eb', '#16a34a'],
      },
    },
    series: […],
  }}
>
```

- **전역 preset:** 앱 `chartTokens.ts`에서 `resolveChartTokens('light', appOverrides)` export 후 재사용
- **차트별:** `options.tokens` partial

### 7.2 CSS chrome

```css
[data-app-workarea] .gen-chart-tooltip {
  box-shadow: none;
  border: 1px solid var(--gen-datagrid-border); /* shell 톤 맞춤 예 */
}
```

gen-datagrid `datagrid-overrides.css`와 **역할은 같고 형식만 다름** (plot은 TS, chrome은 CSS).

### 7.3 스코프

| 스코프 | 예 |
| --- | --- |
| 차트 인스턴스 | `ChartRoot` `options.tokens` |
| 페이지 | wrapper class + CSS chrome |
| 앱 전역 | shared preset module |

---

## 8. 파일 구조 (현재 · 목표)

```text
packages/gen-chart/src/
  index.css              # layout, chrome, motion (theme @import 제거 — 목표)
  themes/
    lightChartTokens.ts  # preset (브리지 점진 적용)
    darkChartTokens.ts
    resolveChartTokens.ts
  types/tokens.ts        # ChartTokens 타입 정본

apps/<app>/src/
  styles/chart-overrides.css   # (선택) chrome CSS — template
  chart/chartTokens.ts         # (선택) 앱 shared preset
```

---

## 9. 비목표

- gen-datagrid식 `--gen-chart-*` **전면 CSS**화 (SVG plot 색)
- theme 패키지에 chart semantic 재도입
- V1 `GenChart.tsx` monolith 스타일 이식
- Phase 2 motion/emphasis 토큰 — [motion.md](../motion.md) 별도

---

## 10. 후속 작업 (구현 전 checklist)

| # | 항목 | 우선 |
| --- | --- | --- |
| H1 | `index.css` theme `@import` 제거 (B) | 높음 |
| H2 | demo ThemeProvider → `options.theme` | 높음 |
| H3 | light/dark preset semantic `var()` bridge | 중 |
| H4 | `chart-overrides.css` template + INDEX 주석 | 낮 |
| H5 | chrome `--gen-chart-*` CSS var (tooltip shadow 등) | 낮 |

코드 변경 시 `implementation-log.md`·`.docs/logs/work-log.md`에 기록한다.

---

## 11. 참고

- 패키지 아키텍처: [architecture.md](../architecture.md) §6 ChartTokens, §11 리스크
- Phase backlog: [phase.md](../phase.md) — ChartTokens ↔ theme D4 정렬
- 레포 토큰 가이드: [08-DESIGN-TOKENS-GUIDE.md](../../../../.docs/08-DESIGN-TOKENS-GUIDE.md)
- 앱 template CSS: [app-styles-naming.md](../../../../apps/demo/.docs/guide/app-styles-naming.md)
