/**
 * @file packages/ui/src/vite-env.d.ts
 * @description Ambient types for Vite CSS Modules and static asset imports.
 * @created 2026-06-23
 */
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const css: string;
  export default css;
}
