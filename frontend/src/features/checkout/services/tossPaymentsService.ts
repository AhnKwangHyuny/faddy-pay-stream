// features/checkout/services/tossPaymentsService.ts
import { requestCardPayment } from '../../../services/payment/tossPayments';
import { PaymentRequest, PaymentResponse } from '../types/checkout.types';

// 토스 결제 요청 서비스
export const processPayment = async (
  paymentRequest: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    // 토스 결제 요청
    const response = await requestCardPayment(paymentRequest);
    return response;
  } catch (error) {
    console.error('토스 결제 처리 중 오류:', error);
    throw error;
  }
};