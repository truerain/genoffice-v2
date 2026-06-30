/**
 * @file apps/demo/src/pages/co/actuals/actuals.types.ts
 * @description Row type for Actuals readonly grid (Gate D4 / Gate 12).
 * @created 2026-06-29
 *
 * @remark
 *
 */

export type ActualsRow = {
  rowId: string;
  fiscalMonth: string;
  orgCd: string;
  orgName: string;
  acctCd: string;
  acctName: string;
  budgetAmt: number;
  actualAmt: number;
  varianceAmt: number;
};

export type ActualsFilterState = {
  fiscalMonth: string;
  orgCd: string;
  acctCd: string;
};
