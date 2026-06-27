<!--
 @file .docs/idea/page-frame-composable.md
 @description Idea draft: composable page frame (StandardPageFrame) for app screens inside MDI.

 @created 2026-06-27

 @remark
 - Status: draft (not adopted)
 - Trigger: gen-chart composable slot pattern (ChartRoot + primitives)
 - Related: packages/mdi/.docs/architecture.md, packages/ui/.docs/composed/split-layout.md
-->
# 아이디어: Composable Page Frame (`StandardPageFrame`)

**상태:** `draft` — 구현·패키지화 미결정

## 1. 배경

`@gen-office/gen-chart` V2 설계에서 **프레임 + slot** composable 패턴을 채택했습니다 (`ChartRoot` → `CartesianChart` → `ChartGrid` / `LineSeries` …).

동일한 사고방식을 **앱 화면(admin·demo 페이지)** 에도 적용하면:

- 페이지마다 `PageHeader` + filter 영역 + work area CSS를 반복 조립하지 않음
- MDI 탭 안 콘텐츠의 **레이아웃·간격·chrome**을 프레임이 통제
- 그리드·차트·SplitLayout은 `children`(work area)에만 집중

gen-chart와의 차이: 페이지 프레임은 **headless model이 필요 없고**, 레이아웃·chrome 프레젠테이션만 담당하면 됨.

---

## 2. 초안 코드 (제안 예시)

패키지명 가칭: `@gen-office/ui-frame` (미확정)

```tsx
// @gen-office/ui-frame의 핵심 코어 컴포넌트 (아이디어 예시)
interface StandardPageFrameProps {
  titleSlot: React.ReactNode;       // 페이지 제목 영역
  filterSlot?: React.ReactNode;     // 상단 검색/필터 조건 영역
  actionSlot?: React.ReactNode;     // 우측 상단 버튼(다운로드 등)
  children: React.ReactNode;        // 메인 컨텐츠 (테이블, 차트 등)
}

export function StandardPageFrame({
  titleSlot,
  filterSlot,
  actionSlot,
  children,
}: StandardPageFrameProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-900">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {titleSlot}
        </div>
        <div className="flex items-center gap-2">
          {actionSlot}
        </div>
      </div>

      {filterSlot && (
        <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-950">
          {filterSlot}
        </div>
      )}

      <div className="grid gap-6">
        {children}
      </div>
    </div>
  );
}
```

위 예시는 **아이디어 스케치**이며, V2 theme·MDI 레이아웃과 맞추려면 스타일·높이 계약을 바꿔야 함 (§5).

---

## 3. V1 대응

V1 demo admin 페이지는 프레임 없이 **수동 조립**합니다.

```text
AdminPageLayout.page          (apps/demo, _shared/AdminPageLayout.module.css)
├── PageHeader                title, description, breadcrumb
├── .filter                   SimpleFilterBar
└── GenGridCrud / content     그리드 + CRUD action bar
```

| V1 | Page frame slot (아이디어) |
| --- | --- |
| `PageHeader` title/description | `titleSlot` (+ description 분리 검토) |
| `PageHeader` breadcrumb | `breadcrumbSlot` (추가 검토) |
| `.filter` + FilterBar | `filterSlot` |
| 페이지 우측 버튼 (드묾) | `actionSlot` |
| 그리드·차트 | `children` |
| CRUD toolbar | **프레임 밖** — `gen-datagrid-crud` 책임 유지 |

V1 참조: `frontend/apps/demo/src/components/PageHeader/`, `pages/admin/_shared/AdminPageLayout.module.css`

---

## 4. gen-chart / MDI와의 관계

```text
AppShell (apps/demo)
└── MDIContainer                    @gen-office/mdi — 탭 chrome
    └── TabPanel
        └── StandardPageFrame?      본 아이디어 — 페이지 chrome
            ├── filterSlot          FilterBar (@gen-office/ui)
            └── children            GenDataGridCrud, ChartRoot, SplitLayout, …
```

| 레이어 | 책임 |
| --- | --- |
| `mdi` | 탭 열기/닫기/전환, TabPanel 높이 |
| **page frame** (아이디어) | 탭 **안** 한 화면의 header / filter / body 레이아웃 |
| `ui` composed | FilterBar, Breadcrumb, SplitLayout |
| feature packages | grid, chart, crud |

MDI와 **역할 겹침 없음** — MDI는 앱 shell, PageFrame은 페이지 shell.

---

## 5. V2에 맞출 때 수정 포인트

초안 코드를 그대로 쓰기 어려운 이유:

### 5.1 높이 계약

- `min-h-screen`은 MDI `TabPanel` 안에서 부적절할 수 있음
- 권장: `height: 100%`, flex column, work area `flex: 1; min-height: 0` (gen-datagrid·SplitLayout과 동일 패턴)

```text
TabPanel (flex 1, min-height 0)
└── PageFrame (height 100%, flex column)
    ├── header
    ├── filter? (flex 0)
    └── body (flex 1, min-height 0)  ← 그리드·차트
```

### 5.2 스타일

- Tailwind `slate-*` 하드코딩 대신 `@gen-office/theme` CSS 변수 + module CSS
- mdi·ui 패키지와 동일한 토큰 소스

### 5.3 action vs CRUD toolbar

- `actionSlot`: 페이지 레벨 (템플릿 다운로드, 새로고침 등)
- 그리드 행 추가/삭제/저장: `gen-datagrid-crud` action bar
- 이중 toolbar가 생기지 않도록 역할을 문서화할 것

### 5.4 breadcrumb / description

- V1 `PageHeader`는 title + description + breadcrumb
- `titleSlot`만 두면 매 페이지가 header 전체를 직접 조립 → `descriptionSlot`, `breadcrumbSlot` 추가 검토

---

## 6. API 형태 대안

### A. Named slot props (초안과 동일)

```tsx
<StandardPageFrame
  titleSlot="사용자 관리"
  filterSlot={<FilterBar ... />}
  actionSlot={<Button>Export</Button>}
>
  <GenDataGridCrud ... />
</StandardPageFrame>
```

- 장점: 단순, 타입 직관적
- 단점: gen-chart compound children 톤과 다름

### B. Compound children (gen-chart 스타일)

```tsx
<PageFrame>
  <PageFrame.Header title="사용자 관리" description="..." breadcrumb={...} />
  <PageFrame.Actions><Button>Export</Button></PageFrame.Actions>
  <PageFrame.Filter><FilterBar ... /></PageFrame.Filter>
  <PageFrame.Body>
    <GenDataGridCrud ... />
  </PageFrame.Body>
</PageFrame>
```

- 장점: slot 순서·필수 영역을 Context로 검증 가능, gen-chart와 톤 일치
- 단점: 구현·문서 약간 무거움

**한 패키지 안에서는 A/B 하나만 선택** (혼용 비권장).

---

## 7. 패키지 위치 (미결정)

| 옵션 | 적합한 경우 |
| --- | --- |
| `packages/ui/src/composed/pageFrame/` | FilterBar·Breadcrumb와 함께, demo·단일 앱 우선 |
| `apps/demo/src/components/` | demo 전용, 재사용 범위 좁음 |
| `packages/ui-frame` (신규) | 여러 앱·제품군 공통 프레임 정책이 커질 때 |

현재 V2는 앱이 `demo` 중심이므로 **우선 `ui/composed` 후보**가 자연스러움. 규모가 커지면 승격 검토.

---

## 8. V2 조정 스케치 (named slot + 토큰)

```tsx
interface PageFrameProps {
  titleSlot: React.ReactNode;
  descriptionSlot?: React.ReactNode;
  breadcrumbSlot?: React.ReactNode;
  filterSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
```

```tsx
<PageFrame
  titleSlot="사용자 관리"
  descriptionSlot="사용자 정보를 조회/관리합니다."
  breadcrumbSlot={<Breadcrumb items={...} />}
  filterSlot={<FilterBar fields={...} onSearch={handleSearch} />}
  actionSlot={<Button variant="outline">템플릿</Button>}
>
  <GenDataGridCrud ... />
</PageFrame>
```

---

## 9. 오픈 질문

1. Named slot vs compound children — 어느 쪽을 공식 API로 할지
2. `PageFrame` vs `StandardPageFrame` — 이름·변형(마스터-디테일용 `SplitPageFrame` 등) 필요 여부
3. filter 없는 화면(dashboard) — `filterSlot` 생략만으로 충분한지, dashboard 전용 프레임 분리 여부
4. i18n — header/filter 라벨은 슬롯에 위임 vs 프레임 기본 문구
5. Storybook — `UI/Composed/PageFrame` gate 필요 여부

---

## 10. 비목표 (아이디어 단계)

- 라우팅·메뉴·권한 (apps/demo shell)
- MDI 탭 상태 (packages/mdi)
- 필터 폼 상태 machine (페이지/훅 책임)
- V1 `PageHeader` API 호환 레이어

---

## 11. 다음 단계 (채택 시)

1. named vs compound 합의
2. `.docs/logs/decisions.md` 또는 `packages/ui/.docs/composed/page-frame.md`로 승격
3. MDI TabPanel + FilterBar + GenDataGridCrud 연동 Storybook 1개
4. demo admin 페이지 1곳 파일럿 전환

---

## 12. 관련 문서

- [gen-chart architecture](../../packages/gen-chart/.docs/architecture.md) — composable slot 참고
- [mdi architecture](../../packages/mdi/.docs/architecture.md) — TabPanel·앱 연동
- [ui split-layout](../../packages/ui/.docs/composed/split-layout.md) — work area 조합
- [ui filter-bar](../../packages/ui/.docs/composed/filter-bar.md) — filterSlot 후보
- [05-GEN-CHART.md](../05-GEN-CHART.md)
