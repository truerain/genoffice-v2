/**
 * @file packages/gen-chart/src/types/common.ts
 * @description Shared utility types for @gen-office/gen-chart public API.
 * @created 2026-06-27
 *
 * @remark
 */

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? U[]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type Accessor<TDatum, TValue> = (datum: TDatum, index: number) => TValue;

export interface ChartPadding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export type ChartTheme = 'light' | 'dark';
