export enum PaymentMethod {
  CARD = "카드",
  VIRTUAL_ACCOUNT = "가상계좌",
  MOBILE_PHONE = "휴대폰",
  TRANSFER = "계좌이체",
  CULTURE_VOUCHER = "문화상품권",
  TOSS_PAY = "토스페이"
}

export enum PaymentStatus {
  READY = "READY",                       // 결제 준비
  DONE = "DONE",                         // 결제 완료
  PARTIAL_CANCELED = "PARTIAL_CANCELED", // 부분 취소
  CANCELED = "CANCELED",                 // 전체 취소
  EXPIRED = "EXPIRED",                   // 만료됨
  SETTLEMENTS_REQUESTED = "SETTLEMENTS_REQUESTED", // 정산 요청
  SETTLEMENTS_COMPLETED = "SETTLEMENTS_COMPLETED", // 정산 완료
  SETTLEMENTS_CANCELED = "SETTLEMENTS_CANCELED"    // 정산 취소
}

export enum AcquireStatus {
  READY = "READY",                   // 준비
  REQUESTED = "REQUESTED",           // 요청됨
  COMPLETED = "COMPLETED",           // 완료
  CANCEL_REQUESTED = "CANCEL_REQUESTED", // 취소 요청
  CANCELLED = "CANCELLED"            // 취소됨
}

export interface CardPayment {
  paymentKey: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  requestedAt?: string;
  approvedAt?: string;
  cardNumber?: string;
  approveNo?: string;
  acquireStatus?: AcquireStatus;
  issuer_code?: string;
  acquirerCode?: string;
  acquirerStatus?: string;
  method?: PaymentMethod;
  balanceAmount?: number;
  receiptUrl?: string;
}

export interface PaymentLedger {
  id: number;
  paymentKey: string;
  orderId: string;
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  balanceAmount: number;
  canceledAmount: number;
  payOutAmount: number;
  receiptUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  settlementRequestedAt?: string;
  settlementCompletedAt?: string;
}

export interface PaymentApproved {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export interface SettlementRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
  merchantId: string;
}

export interface SettlementResult {
  id: string;
  status: 'COMPLETED' | 'CANCELED' | 'FAILED';
  amount: number;
  createdAt: string;
  updatedAt: string;
}
