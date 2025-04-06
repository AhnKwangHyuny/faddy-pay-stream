// 8. Toss Payments 통합
// services/payment/tossPayments.ts
import { loadTossPayments } from '@tosspayments/sdk';
import { PaymentRequest, PaymentResponse } from '../../features/checkout/types/checkout.types';

const TOSS_CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY || '';

export const initializeTossPayments = async () => {
  try {
    return await loadTossPayments(TOSS_CLIENT_KEY);
  } catch (error) {
    console.error('Toss Payments 초기화 오류:', error);
    throw new Error('결제 시스템을 불러오는 데 실패했습니다.');
  }
};

export const requestCardPayment = async (paymentRequest: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const tossPayments = await initializeTossPayments();
    
    const response = await tossPayments.requestPayment('카드', {
      amount: paymentRequest.amount,
      orderId: paymentRequest.orderId,
      orderName: paymentRequest.orderName,
      customerName: paymentRequest.customerName,
      successUrl: paymentRequest.successUrl,
      failUrl: paymentRequest.failUrl
    });
    
    return response as unknown as PaymentResponse;
  } catch (error) {
    console.error('카드 결제 요청 실패:', error);
    throw error;
  }
};