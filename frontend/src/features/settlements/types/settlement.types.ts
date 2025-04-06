export interface Settlement {
  id: number;
  paymentId: string;
  method: string;
  settlementsStatus: SettlementStatus;
  totalAmount: number;
  payOutAmount: number;
  canceledAmount: number;
  soldDate: string;
  paidOutDate: string;
  regDt: string;
  updDt: string;
}

export enum SettlementStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface SettlementFilter {
  status?: SettlementStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SettlementSummary {
  totalSettlements: number;
  totalAmount: number;
  scheduledAmount: number;
  completedAmount: number;
  pendingSettlements: number;
}
