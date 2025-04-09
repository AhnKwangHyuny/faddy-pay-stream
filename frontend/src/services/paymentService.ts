import { CardPayment, PaymentLedger } from '../types/payment.types';
import { apiService } from './api';

// 결제 승인
export const confirmPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<CardPayment> => {
  return apiService.post<CardPayment>('/api/payments/confirm', {
    paymentKey,
    orderId,
    amount,
  });
};

// 결제 정보 조회
export const getPaymentDetails = async (paymentKey: string): Promise<PaymentLedger> => {
  return apiService.get<PaymentLedger>(`/api/payments/${paymentKey}`);
};

// 결제 취소
export const cancelPayment = async (
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
): Promise<PaymentLedger> => {
  return apiService.post<PaymentLedger>(`/api/payments/${paymentKey}/cancel`, {
    cancelReason,
    cancelAmount,
  });
};
