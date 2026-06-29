/**
 * @file apps/demo/src/vite-env.d.ts
 * @description Vite client type references for @gen-office/demo.
 * @created 2026-06-28
 *
 * @remark
 *
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_USE_MOCK_AUTH?: string;
  readonly VITE_USE_MOCK_MENU?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
