/**
 * @file packages/mdi/src/env.d.ts
 * @description Ambient module declarations for @gen-office/mdi.
 * @created 2026-06-27
 */
/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
