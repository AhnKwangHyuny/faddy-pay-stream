// 1. 공통 타입 정의
// shared/types/common.types.ts
export type ApiResponse<T> = {
  status: number;
  data: T;
  message: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type PaymentMethod = 'CARD' | 'VIRTUAL_ACCOUNT' | 'PHONE' | 'TRANSFER';

export type OrderStatus = 
  | 'CREATED' 
  | 'PENDING_PAYMENT' 
  | 'PAID' 
  | 'DELIVERING' 
  | 'DELIVERED' 
  | 'COMPLETED' 
  | 'CANCELED' 
  | 'REFUND_REQUESTED' 
  | 'REFUNDED';