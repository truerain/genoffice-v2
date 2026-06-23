/**
 * @file packages/utils/src/format/number.ts
 * @description Number, currency, percent, file size, and chart axis formatting (ko-KR).
 * @created 2026-06-23
 *
 * @remark
 * - Locale default: ko-KR via Intl.NumberFormat
 * - Exports: formatNumber, formatCurrency, formatPercent, formatFileSize, formatCompactNumber
 * - Back-office display: formatNegativeNumber (△ prefix), formatDeltaFlag (↑↓, optional %)
 * - formatFileSize unit labels (Bytes, KB, …) intentionally English — V1 parity, not ko-KR Intl
 */

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('ko-KR', options).format(value);
};

export const formatCurrency = (value: number, currency: string = 'KRW'): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatPercent = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

/** 음수는 △ 접두사로 표시 (천 단위 구분) */
export const formatNegativeNumber = (value: number, options?: { decimals?: number }): string => {
  const { decimals = 0 } = options || {};
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(abs);

  return value < 0 ? `△${formatted}` : formatted;
};

/** 증감 화살표(↑↓)와 선택적 % 접미사 */
export const formatDeltaFlag = (
  value: number,
  options?: { decimals?: number; isPercent?: boolean },
): string => {
  const { decimals = 0, isPercent = false } = options || {};
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(abs);
  const suffix = isPercent ? '%' : '';

  return value > 0
    ? `${formatted}${suffix}↑`
    : value < 0
      ? `${formatted}${suffix}↓`
      : `-${formatted}${suffix}`;
};
