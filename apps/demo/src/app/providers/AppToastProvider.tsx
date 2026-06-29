/**
 * @file apps/demo/src/app/providers/AppToastProvider.tsx
 * @description App-level toast host for MDI and shell messages (Gate D1).
 * @created 2026-06-28
 *
 * @remark
 * - Exports: AppToastProvider, useAppToast
 * - Uses @gen-office/ui Toast primitives; portalled viewport
 *
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastVariant,
} from '@gen-office/ui';

interface ToastPayload {
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface AppToastContextValue {
  showWarning: (title: string, description?: string) => void;
}

const AppToastContext = createContext<AppToastContextValue | null>(null);

export function AppToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [open, setOpen] = useState(false);

  const publish = useCallback((payload: ToastPayload) => {
    setToast(payload);
    setOpen(true);
  }, []);

  const showWarning = useCallback(
    (title: string, description?: string) => {
      publish({ title, description, variant: 'warning' });
    },
    [publish],
  );

  const value = useMemo(() => ({ showWarning }), [showWarning]);

  return (
    <AppToastContext.Provider value={value}>
      <ToastProvider duration={4000}>
        {children}
        {toast ? (
          <Toast open={open} onOpenChange={setOpen} variant={toast.variant}>
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description ? (
              <ToastDescription>{toast.description}</ToastDescription>
            ) : null}
            <ToastClose />
          </Toast>
        ) : null}
        <ToastViewport portalled />
      </ToastProvider>
    </AppToastContext.Provider>
  );
}

export function useAppToast(): AppToastContextValue {
  const context = useContext(AppToastContext);
  if (!context) {
    throw new Error('useAppToast must be used within AppToastProvider');
  }
  return context;
}
