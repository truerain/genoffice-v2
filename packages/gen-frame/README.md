# @gen-office/gen-frame

GenOffice V2 **앱 프레임워크** 패키지 — 레이아웃 chrome, 내비게이션 오케스트레이션, URL ↔ 페이지 연동.

- **문서:** [`.docs/README.md`](./.docs/README.md)
- **아키텍처:** [`.docs/architecture.md`](./.docs/architecture.md)
- **구현 Plan:** [`.docs/plan.md`](./.docs/plan.md)

`gen-grid` / `gen-chart` / `gen-datagrid`와 같은 `gen-*` 제품군이며, 백오피스 앱의 **작업 공간 골격**을 담당합니다.

## Quick start

```tsx
import { WorkspaceFrame } from '@gen-office/gen-frame';
import '@gen-office/gen-frame/index.css';

<WorkspaceFrame
  layout="leftPanel"
  header={<span>My App</span>}
  menu={{ items: [{ id: 'home', label: 'Home' }] }}
  workarea={<main>Content</main>}
/>
```

부모에 `height: 100%` + flex `min-height: 0` 체인이 필요합니다.

## Brand logo (`FrameBrand`)

기본 로고는 `packages/gen-frame/src/assets/default-logo.png`입니다. 앱은 `header` 슬롯에서 `src`로 교체합니다.

```tsx
import { WorkspaceFrame, FrameBrand } from '@gen-office/gen-frame';
import appLogo from './assets/brand-logo.png';

<WorkspaceFrame
  header={<FrameBrand src={appLogo} alt="My App" />}
  ...
/>

// 기본 gen-frame 로고
<FrameBrand alt="GenOffice" />
```

`DEFAULT_FRAME_BRAND_LOGO_SRC` 상수도 export됩니다.

## Navigation mode

gen-frame은 **동일한 `NavigationController` 계약**으로 MDI·단일 페이지를 전환합니다.

| Mode | Host | Hook / factory | 필요 peer |
| --- | --- | --- | --- |
| `mdi` | `MdiPageHost` | `useMdiNavigationController` | `@gen-office/mdi` |
| `single` | `SinglePageHost` | `useSingleNavigationController` | — |

### MDI (탭)

```tsx
import {
  WorkspaceFrame,
  MdiPageHost,
  useMdiNavigationController,
} from '@gen-office/gen-frame';

const { controller } = useMdiNavigationController({
  resolveTab,
  pinnedPages: [
    { pageId: 'home', title: 'Welcome', meta: { componentName: 'HomePage' } },
  ],
});

<WorkspaceFrame
  menu={{ items }}
  activeMenuId={activeTabId}
  onMenuSelect={(item) => controller.open({ pageId: item.id, title: item.label, meta })}
  workarea={<MdiPageHost emptyContent={<>...</>} />}
/>
```

앱은 `resolveTab`에서 registry로 `content`를 만듭니다. `pinnedPages`는 mount 시 `closable: false` 탭을 보장합니다 (Close All 후에도 유지). 탭 상태는 `@gen-office/mdi` store가 보관합니다.

### Single (단일 페이지)

```tsx
import {
  WorkspaceFrame,
  SinglePageHost,
  useSingleNavigationController,
} from '@gen-office/gen-frame';

const { controller, currentPage } = useSingleNavigationController({ resolvePage });

<WorkspaceFrame
  menu={{ items }}
  activeMenuId={currentPage?.pageId}
  onMenuSelect={(item) => controller.open({ pageId: item.id, title: item.label })}
  workarea={<SinglePageHost page={currentPage} emptyContent={<>...</>} />}
/>
```

MDI 없이 단일 workarea만 필요할 때 사용합니다. URL sync(`useUrlSync`)는 두 모드 모두 동일하게 연결할 수 있습니다.

### Peer dependencies

- `react`, `react-dom` — 필수
- `@gen-office/mdi` — **MDI 모드만** 필요 (`MdiPageHost`, `useMdiNavigationController`). single 모드만 쓰는 앱은 mdi를 설치하지 않아도 됩니다(현재 패키지 빌드 산출물에는 mdi 연동 코드가 포함됨).

Storybook: `GenFrame/Navigation/Single` — 동일 메뉴로 single / MDI 비교 showcase.
