// features/checkout/hooks/usePayment.ts
import { useState } from 'react';
import { PaymentMethod } from '../../../shared/types/common.types';
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
      const successUrl = `${baseUrl}/payment/complete`;
      const failUrl = `${baseUrl}/payment/fail`;
      
      // 결제 방법에 따라 다른 결제 프로세스 실행
      if (options.paymentMethod === 'CARD') {
        // 토스페이먼츠 결제 페이지로 리다이렉트
        await processPayment({
          orderId: options.orderId,
          orderName: options.orderName,
          amount: options.amount,
          customerName: options.customerName,
          successUrl,
          failUrl
        });
        
        // 리다이렉트되므로 이 코드는 실행되지 않음
        // options.onSuccess();
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