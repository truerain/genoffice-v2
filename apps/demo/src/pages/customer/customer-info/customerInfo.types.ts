/**
 * @file apps/demo/src/pages/customer/customer-info/customerInfo.types.ts
 * @description Customer inquiry / CRUD demo row and filter types.
 * @created 2026-07-01
 *
 * @remark
 *
 */

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export type CustomerGrade = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  registeredAt: string;
  lastContactAt: string;
  totalOrders: number;
  totalSpent: number;
  grade: CustomerGrade;
}

export interface CustomerFilterState {
  search: string;
  status: CustomerStatus | 'all';
  grade: CustomerGrade | 'all';
}
