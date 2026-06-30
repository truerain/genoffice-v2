/**
 * @file apps/demo/src/pages/co/actuals/actualsData.ts
 * @description Mock actuals dataset for readonly grid smoke (Gate D4).
 * @created 2026-06-29
 *
 * @remark
 *
 */

import type { ActualsFilterState, ActualsRow } from './actuals.types';

const FISCAL_MONTHS = ['2026-01', '2026-02', '2026-03', '2026-04'];
const ORGS = [
  { orgCd: 'HQ', orgName: 'Head Office' },
  { orgCd: 'SALES', orgName: 'Sales Division' },
  { orgCd: 'OPS', orgName: 'Operations' },
];
const ACCOUNTS = [
  { acctCd: '4000', acctName: 'Revenue' },
  { acctCd: '5000', acctName: 'COGS' },
  { acctCd: '6000', acctName: 'Operating Expense' },
  { acctCd: '6100', acctName: 'Payroll' },
  { acctCd: '6200', acctName: 'Marketing' },
];

function pseudoAmount(seed: number): number {
  return Math.round((seed * 137 + 4821) % 950_000) + 12_000;
}

export function createMockActualsRows(count = 240): ActualsRow[] {
  const rows: ActualsRow[] = [];
  for (let index = 0; index < count; index += 1) {
    const org = ORGS[index % ORGS.length]!;
    const account = ACCOUNTS[index % ACCOUNTS.length]!;
    const fiscalMonth = FISCAL_MONTHS[index % FISCAL_MONTHS.length]!;
    const budgetAmt = pseudoAmount(index + 1);
    const actualAmt = pseudoAmount(index + 17);
    rows.push({
      rowId: `act-${index + 1}`,
      fiscalMonth,
      orgCd: org.orgCd,
      orgName: org.orgName,
      acctCd: account.acctCd,
      acctName: account.acctName,
      budgetAmt,
      actualAmt,
      varianceAmt: actualAmt - budgetAmt,
    });
  }
  return rows;
}

export function filterActualsRows(
  source: readonly ActualsRow[],
  filters: ActualsFilterState,
): ActualsRow[] {
  const fiscalMonth = filters.fiscalMonth.trim();
  const orgCd = filters.orgCd.trim().toUpperCase();
  const acctCd = filters.acctCd.trim();

  return source.filter((row) => {
    if (fiscalMonth && row.fiscalMonth !== fiscalMonth) return false;
    if (orgCd && !row.orgCd.toUpperCase().includes(orgCd)) return false;
    if (acctCd && !row.acctCd.includes(acctCd)) return false;
    return true;
  });
}

export const MOCK_ACTUALS_SOURCE = createMockActualsRows();
