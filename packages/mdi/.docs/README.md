# @gen-office/mdi

Tab 기반 Multiple Document Interface (MDI) 컴포넌트 패키지

> 구조·컴포넌트 계층·상태 흐름: [architecture.md](./architecture.md)  
> 검토·개선 우선순위: [review-plan.md](./review-plan.md)

## Features

- 🎯 **Tab 기반 인터페이스**: 브라우저 탭과 유사한 직관적인 UI
- 💾 **상태 유지**: 탭 전환 시 이전 탭의 상태 완전 보존
- 📍 **탭 위치 선택**: Top/Bottom 탭 바 위치 지원
- 🔢 **최대 탭 제한**: 선택적 최대 탭 개수 설정
- 🎨 **테마 지원**: LG Design System 기반 디자인
- ♿ **접근성**: ARIA 속성 완벽 지원
- 🔄 **Zustand 상태관리**: 전역 탭 상태 관리

## Installation

```bash
pnpm add @gen-office/mdi
```

## Usage

### Basic Example

```tsx
import { MDIContainer, useMDIStore } from '@gen-office/mdi';
import '@gen-office/mdi/index.css';

function App() {
  const addTab = useMDIStore(state => state.addTab);

  const handleOpenTab = () => {
    addTab({
      id: 'customer-1',
      title: '고객 상세',
      content: <CustomerDetail id="1" />,
      closable: true,
      icon: <UserIcon />
    });
  };

  return (
    <div style={{ height: '100vh' }}>
      <button onClick={handleOpenTab}>Open Tab</button>
      <MDIContainer 
        maxTabs={10}
        tabPosition="top"
      />
    </div>
  );
}
```

### With Maximum Tabs Warning

```tsx
<MDIContainer 
  maxTabs={5}
  onMaxTabsReached={() => {
    alert('최대 5개까지만 탭을 열 수 있습니다.');
  }}
/>
```

### Bottom Tab Position

```tsx
<MDIContainer 
  tabPosition="bottom"
/>
```

### Custom Empty State

```tsx
<MDIContainer 
  emptyContent={
    <div>
      <h2>탭이 없습니다</h2>
      <p>새 탭을 열어주세요</p>
    </div>
  }
/>
```

## API

### MDIContainer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxTabs` | `number \| undefined` | `undefined` | 최대 탭 개수. **하향해도 이미 연 탭은 유지**되며, 초과분 신규 `addTab`만 거부 |
| `tabPosition` | `'top' \| 'bottom'` | `'top'` | 탭 바 위치 |
| `emptyContent` | `ReactNode` | `'No tabs open'` | 탭이 없을 때 표시할 내용 |
| `onMaxTabsReached` | `() => void` | - | 최대 탭 개수 초과로 **신규** `addTab`이 거부될 때 호출 (기존 id 포커스는 제외) |
| `className` | `string` | - | 커스텀 클래스명 |

### useMDIStore Hook

```tsx
const {
  // State
  tabs,          // MDITab[]
  activeTabId,   // string | null
  maxTabs,       // number | undefined
  tabPosition,   // 'top' | 'bottom'
  
  // Actions
  addTab,        // (tab: MDITab) => boolean
  removeTab,     // (id: string) => void
  setActiveTab,  // (id: string) => void
  updateTab,     // (id: string, updates: Partial<MDITab>) => void
  closeAllTabs,  // () => void
  closeOtherTabs,// (id: string) => void
} = useMDIStore();
```

### MDITab Interface

```typescript
interface MDITab {
  id: string;              // 고유 식별자
  title: string;           // 탭 제목
  content: ReactNode;      // 탭 콘텐츠
  closable?: boolean;      // 닫기 버튼 표시 여부 (기본: true)
  icon?: ReactNode;        // 탭 아이콘
  meta?: Record<string, any>; // 메타데이터
}
```

### 동일 id로 `addTab` 재호출

이미 열린 **같은 `id`**로 `addTab`을 호출하면 **탭을 새로 만들지 않고 focus만** 합니다. title/content는 **갱신되지 않습니다** (탭 상태 보존).

- 제목·콘텐츠 변경: `updateTab(id, { title, content, ... })`
- 완전히 새로 열기: `removeTab(id)` 후 `addTab(...)`
- focus만: `setActiveTab(id)`

## Examples

### Adding Multiple Tabs

```tsx
function MyApp() {
  const addTab = useMDIStore(state => state.addTab);

  const openCustomerTab = (customerId: string) => {
    const success = addTab({
      id: `customer-${customerId}`,
      title: `고객 ${customerId}`,
      content: <CustomerDetail id={customerId} />,
    });
    
    if (!success) {
      console.warn('최대 탭 개수에 도달했습니다.');
    }
  };

  return (
    <MDIContainer maxTabs={5} />
  );
}
```

### Programmatic Tab Management

```tsx
function TabControls() {
  const { tabs, activeTabId, closeAllTabs, closeOtherTabs } = useMDIStore();

  return (
    <div>
      <button onClick={closeAllTabs}>
        모든 탭 닫기
      </button>
      {activeTabId && (
        <button onClick={() => closeOtherTabs(activeTabId)}>
          다른 탭 모두 닫기
        </button>
      )}
      <span>{tabs.length}개 탭 열림</span>
    </div>
  );
}
```

### Dynamic Tab Updates

```tsx
function CustomerTab({ customerId }: { customerId: string }) {
  const updateTab = useMDIStore(state => state.updateTab);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchCustomer(customerId).then(data => {
      setCustomer(data);
      // 탭 제목 업데이트
      updateTab(`customer-${customerId}`, {
        title: `${data.name} (${data.company})`
      });
    });
  }, [customerId]);

  return <div>{/* customer content */}</div>;
}
```

## State Preservation

탭 전환 시 각 탭의 상태가 완전히 보존됩니다:

- ✅ React 컴포넌트 상태 (useState, useReducer)
- ✅ Form 입력값
- ✅ 스크롤 위치
- ✅ React Query 캐시
- ✅ 로컬 이벤트 리스너

탭이 숨겨질 때 `display: none`으로 처리되어 DOM에 유지되므로, unmount/remount 없이 상태가 보존됩니다.

## Styling

MDI 컴포넌트는 CSS 변수를 통해 테마를 지원합니다:

```css
/* 커스터마이징 예시 */
:root {
  --mdi-tab-height: 40px;
  --mdi-tab-min-width: 120px;
  --mdi-tab-max-width: 240px;
}
```

## License

MIT