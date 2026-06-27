/**
 * @file packages/mdi/src/components/MDIContainer/MDIContainer.stories.tsx
 * @description Storybook stories for MDIContainer (Storybook Gate §6).
 * @created 2026-06-27
 *
 * @remark
 * - title: MDI/MDIContainer
 * - Parent frame: explicit height + flex min-height 0
 * - Store reset per story via decorator
 */
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Input } from '@gen-office/ui';
import { FileText, Home, Settings } from 'lucide-react';
import { MDIContainer } from './MDIContainer';
import { useMDIStore } from '../../store/mdiStore';

const meta: Meta<typeof MDIContainer> = {
  title: 'MDI/MDIContainer',
  component: MDIContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      function StoreResetDecorator() {
        useEffect(() => {
          useMDIStore.getState().reset();
          return () => useMDIStore.getState().reset();
        }, []);
        return <Story />;
      }
      return <StoreResetDecorator />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = Pick<Story, 'render' | 'parameters'>;

const frameStyle: CSSProperties = {
  width: '100%',
  maxWidth: 960,
  height: 480,
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--color-border-default)',
  borderRadius: 8,
  overflow: 'hidden',
  minHeight: 0,
};

const toolbarStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  padding: '12px 0',
  alignItems: 'center',
};

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.875rem',
  color: 'var(--color-fg-secondary)',
};

function TabDemoPanel({ title }: { title: string }) {
  const [value, setValue] = useState('');

  return (
    <div style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: '1rem' }}>{title}</h3>
      <p style={hintStyle}>
        탭을 전환해도 입력값이 유지되는지 확인하세요 (display:none 패널, unmount 없음).
      </p>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="상태 보존 테스트 입력"
      />
    </div>
  );
}

function OpenTabsToolbar({ maxTabs }: { maxTabs?: number }) {
  const addTab = useMDIStore((state) => state.addTab);
  const tabs = useMDIStore((state) => state.tabs);

  const openSampleTabs = () => {
    addTab({
      id: 'home',
      title: 'Home',
      icon: <Home size={14} />,
      content: <TabDemoPanel title="Home" />,
    });
    addTab({
      id: 'reports',
      title: 'Reports',
      icon: <FileText size={14} />,
      content: <TabDemoPanel title="Reports" />,
    });
    addTab({
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={14} />,
      content: <TabDemoPanel title="Settings" />,
    });
  };

  return (
    <div style={toolbarStyle}>
      <button type="button" onClick={openSampleTabs}>
        Open 3 sample tabs
      </button>
      <span style={hintStyle}>
        {tabs.length} tab(s) open{maxTabs != null ? ` · max ${maxTabs}` : ''}
      </span>
    </div>
  );
}

export const Default: RenderStory = {
  render: () => (
    <div>
      <OpenTabsToolbar />
      <div style={frameStyle}>
        <MDIContainer />
      </div>
    </div>
  ),
};

function MaxTabsDemo() {
  const addTab = useMDIStore((state) => state.addTab);
  const [hits, setHits] = useState(0);

  const openExtra = () => {
    const id = `extra-${Date.now()}`;
    addTab({
      id,
      title: `Extra ${id.slice(-4)}`,
      content: <TabDemoPanel title="Extra tab" />,
    });
  };

  return (
    <div>
      <p style={hintStyle}>
        maxTabs=2. 세 번째 신규 탭은 거부되며 <code>onMaxTabsReached</code>가 호출됩니다. 동일 id 재오픈은
        focus-only입니다.
      </p>
      <div style={toolbarStyle}>
        <button type="button" onClick={openExtra}>
          Add tab
        </button>
        <button
          type="button"
          onClick={() =>
            addTab({
              id: 'home',
              title: 'Home',
              content: <TabDemoPanel title="Home" />,
            })
          }
        >
          Focus Home (same id)
        </button>
        <span style={hintStyle}>onMaxTabsReached: {hits}×</span>
      </div>
      <div style={frameStyle}>
        <MDIContainer maxTabs={2} onMaxTabsReached={() => setHits((count) => count + 1)} />
      </div>
    </div>
  );
}

export const MaxTabs: RenderStory = {
  render: () => <MaxTabsDemo />,
};

export const BottomTabs: RenderStory = {
  render: () => (
    <div>
      <OpenTabsToolbar />
      <p style={hintStyle}>tabPosition=&quot;bottom&quot; — 탭 바가 콘텐츠 아래에 표시됩니다.</p>
      <div style={frameStyle}>
        <MDIContainer tabPosition="bottom" />
      </div>
    </div>
  ),
};

export const ContextMenu: RenderStory = {
  parameters: {
    docs: {
      description: {
        story:
          '탭을 우클릭하여 Close / Close Others / Close All 메뉴를 확인하세요. 키보드: ←/→/Home/End.',
      },
    },
  },
  render: () => (
    <div>
      <OpenTabsToolbar />
      <p style={hintStyle}>탭 우클릭 → 컨텍스트 메뉴. tabBarLabels로 i18n 가능.</p>
      <div style={frameStyle}>
        <MDIContainer
          tabBarLabels={{
            close: '닫기',
            closeOthers: '다른 탭 닫기',
            closeAll: '모두 닫기',
          }}
        />
      </div>
    </div>
  ),
};

function ClosableFalseDemo() {
  useEffect(() => {
    const { addTab } = useMDIStore.getState();
    addTab({
      id: 'dashboard',
      title: 'Dashboard (pinned)',
      closable: false,
      content: <TabDemoPanel title="Pinned dashboard" />,
    });
    addTab({
      id: 'users',
      title: 'Users',
      content: <TabDemoPanel title="Users" />,
    });
    addTab({
      id: 'orders',
      title: 'Orders',
      content: <TabDemoPanel title="Orders" />,
    });
  }, []);

  return (
    <div>
      <p style={hintStyle}>
        Dashboard는 closable=false. Close Others / Close All 시 pin 탭만 남습니다.
      </p>
      <div style={frameStyle}>
        <MDIContainer />
      </div>
    </div>
  );
}

export const ClosableFalse: RenderStory = {
  render: () => <ClosableFalseDemo />,
};

export const Empty: RenderStory = {
  render: () => (
    <div style={frameStyle}>
      <MDIContainer
        emptyContent={
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>열린 탭이 없습니다</p>
            <p style={{ ...hintStyle, marginTop: 8 }}>메뉴에서 화면을 선택하세요.</p>
          </div>
        }
      />
    </div>
  ),
};
