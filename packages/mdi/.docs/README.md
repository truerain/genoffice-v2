# @gen-office/mdi

Tab 기반 Multiple Document Interface (MDI) 컴포넌트 패키지

> 구조·컴포넌트 계층·상태 흐름: [architecture.md](./architecture.md)  
> 검토 Plan: [review-plan.md](./review-plan.md) — **패키지 리뷰 1차 마감 (2026-06-27)**  
> Storybook: `pnpm -C apps/storybook dev` → **MDI/MDIContainer**

## Features

- **Tab 기반 인터페이스**: 브라우저 탭과 유사한 UI
- **상태 유지**: 탭 전환 시 React state·form·스크롤 보존 (`display: none`, unmount 없음)
- **탭 위치**: Top / Bottom
- **최대 탭 제한**: `maxTabs` + `onMaxTabsReached` 콜백
- **테마**: `@gen-office/theme` CSS 변수
- **접근성**: ARIA tabs, ←/→/Home/End, 포커스 관리
- **Zustand**: 기본 singleton; **`MDIStoreProvider`로 인스턴스 격리** (Storybook Docs·다중 pane)

## Installation

```bash
pnpm add @gen-office/mdi
```

## Quick Start

```tsx
import { MDIContainer, useMDIStore } from '@gen-office/mdi';
import '@gen-office/mdi/index.css';

function App() {
  const addTab = useMDIStore((state) => state.addTab);

  const handleOpenTab = () => {
    addTab({
      id: 'customer-1',
      title: '고객 상세',
      content: <CustomerDetail id="1" />,
      closable: true,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <button type="button" onClick={handleOpenTab}>
        Open Tab
      </button>
      <main style={{ flex: 1, minHeight: 0 }}>
        <MDIContainer maxTabs={10} tabPosition="top" />
      </main>
    </div>
  );
}
```

부모 레이아웃은 `flex: 1` + `min-height: 0` 체인이 필요합니다. 자세한 내용은 [architecture.md §8](./architecture.md).

## Public API

| 그룹 | Export |
| --- | --- |
| Components | `MDIContainer`, `TabBar`, `Tab`, `TabPanel` |
| Store | `useMDIStore`, `createMDIStore`, `MDIStoreProvider` |
| Types | `MDITab`, `MDIStore`, `MDIContainerProps`, `TabBarProps`, `TabBarLabels`, … |
| Constants | `DEFAULT_TAB_BAR_LABELS` |

## MDIContainer Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `maxTabs` | `number \| undefined` | `undefined` | 최대 탭 개수. **하향해도 이미 연 탭은 유지**, 신규 `addTab`만 거부 |
| `tabPosition` | `'top' \| 'bottom'` | `'top'` | 탭 바 위치 |
| `emptyContent` | `ReactNode` | `'No tabs open'` | 탭 없을 때 표시 |
| `onMaxTabsReached` | `() => void` | — | limit 초과로 **신규** `addTab` 거부 시 호출 (기존 id focus는 제외) |
| `tabBarLabels` | `TabBarLabels` | 영문 기본 | 컨텍스트 메뉴 라벨 (`close`, `closeOthers`, `closeAll`) |
| `className` | `string` | — | 루트 클래스 |

## maxTabs · 사용자 메시지

패키지는 **toast/alert UI를 내장하지 않습니다.** limit 초과 시:

1. `addTab` → `false` 반환
2. `console.warn` (영문, 개발용)
3. `onMaxTabsReached` 콜백 (UI는 **앱/demo**에서 처리)

```tsx
<MDIContainer
  maxTabs={5}
  onMaxTabsReached={() => {
    toast.warning('최대 5개까지만 탭을 열 수 있습니다.');
  }}
/>
```

`addTab` 반환값과 `onMaxTabsReached`를 **동시에** 쓰면 메시지가 중복될 수 있으므로, 보통 **콜백 한 곳**에서 처리합니다.

## useMDIStore

Provider 없이 사용하면 **앱 전역 singleton** (`defaultMDIStore`)을 공유합니다.

```tsx
const tabs = useMDIStore((state) => state.tabs);
const addTab = useMDIStore((state) => state.addTab);
const removeTab = useMDIStore((state) => state.removeTab);
const setActiveTab = useMDIStore((state) => state.setActiveTab);
const updateTab = useMDIStore((state) => state.updateTab);
const closeAllTabs = useMDIStore((state) => state.closeAllTabs);
const closeAllClosableTabs = useMDIStore((state) => state.closeAllClosableTabs);
const closeOtherTabs = useMDIStore((state) => state.closeOtherTabs);
```

`addTab(tab)` → `boolean` — 신규 id 추가 성공 `true`, maxTabs 거부 `false`, **기존 id focus** `true`.

> `useMDIStore.getState()` / `setState()` / `subscribe()` 는 **default singleton** 전용입니다.  
> Provider subtree에서 imperative 접근은 [architecture.md §4](./architecture.md)의 `useMDIStoreApi()`를 참고하세요.

## MDIStoreProvider (다중 인스턴스·Storybook)

Storybook Docs처럼 여러 `MDIContainer`가 동시에 mount되거나, 화면에 MDI가 2개 이상이면 Provider로 store를 분리합니다.

```tsx
import { MDIContainer, MDIStoreProvider, useMDIStore } from '@gen-office/mdi';

function SplitWorkspace() {
  return (
    <div style={{ display: 'flex', gap: 16, height: '100%' }}>
      <MDIStoreProvider>
        <MDIContainer maxTabs={5} />
      </MDIStoreProvider>
      <MDIStoreProvider>
        <MDIContainer maxTabs={5} />
      </MDIStoreProvider>
    </div>
  );
}
```

단일 demo shell(MDI 1개)은 Provider **불필요**합니다.

## MDITab

```typescript
interface MDITab {
  id: string;
  title: string;
  content: ReactNode;
  closable?: boolean;   // default true; false면 removeTab·닫기 UI no-op
  icon?: ReactNode;
  meta?: Record<string, unknown>;
}
```

### 동일 id로 `addTab` 재호출

이미 열린 **같은 `id`** → **focus만** (title/content **미갱신**, 상태 보존).

- 내용 갱신: `updateTab(id, { title, content, … })`
- 새로 열기: `removeTab(id)` 후 `addTab(...)`
- focus만: `setActiveTab(id)`

## Examples

### Bottom tabs · empty state · i18n

```tsx
<MDIContainer
  tabPosition="bottom"
  tabBarLabels={{ close: '닫기', closeOthers: '다른 탭 닫기', closeAll: '모두 닫기' }}
  emptyContent={<p>열린 탭이 없습니다.</p>}
/>
```

### Programmatic tab management

```tsx
function TabControls() {
  const tabs = useMDIStore((s) => s.tabs);
  const activeTabId = useMDIStore((s) => s.activeTabId);
  const closeAllTabs = useMDIStore((s) => s.closeAllTabs);
  const closeOtherTabs = useMDIStore((s) => s.closeOtherTabs);

  return (
    <div>
      <button type="button" onClick={closeAllTabs}>
        모든 탭 닫기
      </button>
      {activeTabId && (
        <button type="button" onClick={() => closeOtherTabs(activeTabId)}>
          다른 탭 모두 닫기
        </button>
      )}
      <span>{tabs.length}개 탭 열림</span>
    </div>
  );
}
```

## State Preservation

비활성 탭은 `TabPanel`에서 `display: none`으로 숨기며 **DOM·React tree를 유지**합니다.

- React state (useState, useReducer)
- Form 입력값
- 스크롤 위치
- Query 캐시 등

## Styling

```bash
import '@gen-office/mdi/index.css';
```

`src/index.ts` import만으로 theme + 컴포넌트 CSS가 함께 로드됩니다. CSS만 필요하면 `@gen-office/mdi/index.css`를 직접 import 해도 됩니다.

## Verification

```bash
pnpm -C packages/mdi test    # 41 tests
pnpm -C packages/mdi build
pnpm -C apps/storybook dev   # MDI/MDIContainer
```

## License

MIT
