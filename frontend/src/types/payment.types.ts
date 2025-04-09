export enum PaymentMethod {
  CARD = "카드"
}

export enum PaymentStatus {
  DONE = "DONE",
  PARTIAL_CANCELED = "PARTIAL_CANCELED",
  CANCELED = "CANCELED",
  SETTLEMENTS_REQUESTED = "SETTLEMENTS_REQUESTED",
  SETTLEMENTS_COMPLETED = "SETTLEMENTS_COMPLETED",
  SETTLEMENTS_CANCELED = "SETTLEMENTS_CANCELED"
}

export enum AcquireStatus {
  READY = "READY",
  REQUESTED = "REQUESTED",
  COMPLETED = "COMPLETED",
  CANCEL_REQUESTED = "CANCEL_REQUESTED",
  CANCELLED = "CANCELLED"
}

export interface CardPayment {
  paymentKey: string;
  cardNumber: string;
  approveNo: string;
  acquireStatus: AcquireStatus;
  issuer_code: string;
  acquirerCode: string;
  acquirerStatus: string;
}

export interface PaymentLedger {
  id: number;
  paymentKey: string;
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  balanceAmount: number;
  canceledAmount: number;
  payOutAmount: number;
  createdAt?: string;
  updatedAt?: string;
}
