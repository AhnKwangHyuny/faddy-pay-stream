// 4. 결제 관련 타입 정의
// features/checkout/types/checkout.types.ts
import { PaymentMethod } from '../../../shared/types/common.types';

export interface Address {
  name: string;
  phoneNumber: string;
  zipCode: string;
  address1: string;
  address2: string;
  isDefault?: boolean;
}

export interface CheckoutFormData {
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  agreeToTerms: boolean;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
}

export interface PaymentResponse {
  paymentId: string;
  paymentKey: string;
  status: string;
  transactionKey: string;
  requestedAt: string;
  approvedAt?: string;
}