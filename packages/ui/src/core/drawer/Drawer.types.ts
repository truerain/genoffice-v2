/**
 * @file packages/ui/src/core/drawer/Drawer.types.ts
 * @description Public props for Drawer slide-over panel.
 * @created 2026-06-24
 */
import type { ReactNode } from 'react';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  /** Drawer 표시 여부 */
  open: boolean;
  /** Drawer 열림/닫힘 상태 변경 핸들러 */
  onOpenChange: (open: boolean) => void;
  /** Drawer 제목 */
  title?: string | ReactNode;
  /** Drawer 설명 */
  description?: string | ReactNode;
  /** Drawer 내용 */
  children: ReactNode;
  /** Drawer가 나타나는 위치 @default 'right' */
  side?: DrawerSide;
  /** 오버레이 클릭 시 닫기 여부 @default true */
  closeOnOverlayClick?: boolean;
  /** ESC 키로 닫기 여부 @default true */
  closeOnEsc?: boolean;
  /** Footer 영역 (버튼 등) */
  footer?: ReactNode;
  /** Drawer 너비/높이 (side에 따라 다름) @default 'md' */
  size?: DrawerSize;
}
