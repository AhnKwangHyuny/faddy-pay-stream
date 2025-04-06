// features/checkout/hooks/usePayment.ts
import { useState } from 'react';
import { PaymentMethod } from '../../../shared/types/common.types';
import { createPaymentRequest } from '../services/checkoutApi';
import { processPayment } from '../services/tossPaymentsService';

interface PaymentOptions {
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  paymentMethod: PaymentMethod;
  onSuccess: () => void;
  onFailure: (error: Error) => void;
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 결제 초기화 및 처리
  const initiatePayment = async (options: PaymentOptions): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // 현재 도메인 기반으로 결제 콜백 URL 설정
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/payment/success`;
      const failUrl = `${baseUrl}/payment/fail`;
      
      // 결제 요청 생성
      const paymentRequest = await createPaymentRequest(
        options.orderId,
        options.amount,
        options.customerName
      );
      
      // 결제 방법에 따라 다른 결제 프로세스 실행
      if (options.paymentMethod === 'CARD') {
        await processPayment({
          ...paymentRequest,
          successUrl,
          failUrl
        });
        
        // 성공 콜백 실행 (실제로는 리다이렉트 후 실행됨)
        options.onSuccess();
      } else {
        throw new Error('지원하지 않는 결제 방법입니다.');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onFailure(error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    initiatePayment
  };
};