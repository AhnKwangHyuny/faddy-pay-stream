import { CardPayment, PaymentLedger } from '../types/payment.types';
import { apiService } from './api';

// 결제 승인
export const confirmPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<CardPayment> => {
  try {
    // API 기본 URL을 제거하고 절대 경로로 호출
    const response = await apiService.post<any>('/confirm', {
      paymentKey,
      orderId,
      amount,
    });
    
    // ApiResponse 구조 처리
    if (response && response.success === true) {
      return response.data;
    }
    return response;
  } catch (error) {
    console.error('결제 승인 실패:', error);
    throw error;
  }
};

// 결제 성공 후 결과 조회
export const getPaymentSuccess = async (
  paymentKey: string,
  orderId: string,
  amount: number,
  paymentType: string = 'CARD'
): Promise<string> => {
  try {
    const response = await apiService.get<any>(
      `/success?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}&paymentType=${paymentType}`
    );
    
    // ApiResponse 구조 처리
    if (response && response.success === true) {
      return response.data;
    }
    return response;
  } catch (error) {
    console.error('결제 성공 처리 실패:', error);
    throw error;
  }
};

// 결제 실패 처리
export const handlePaymentFailure = async (message: string): Promise<string> => {
  try {
    const response = await apiService.get<any>(`/fail?message=${encodeURIComponent(message)}`);
    
    // 실패 응답 구조도 확인
    if (response) {
      return response.message || response;
    }
    return response;
  } catch (error) {
    console.error('결제 실패 처리 오류:', error);
    throw error;
  }
};

// 결제 정보 조회
export const getPaymentDetails = async (paymentKey: string): Promise<PaymentLedger> => {
  try {
    return await apiService.get<PaymentLedger>(`/api/payments/${paymentKey}`);
  } catch (error) {
    console.error(`결제 정보 조회 실패: ${paymentKey}`, error);
    throw error;
  }
};

// 결제 취소
export const cancelPayment = async (
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
): Promise<PaymentLedger> => {
  try {
    return await apiService.post<PaymentLedger>(`/api/payments/${paymentKey}/cancel`, {
      cancelReason,
      cancelAmount,
    });
  } catch (error) {
    console.error(`결제 취소 실패: ${paymentKey}`, error);
    throw error;
  }
};

// 결제 위젯 로드 헬퍼 함수
export const loadTossPaymentsWidget = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 스크립트가 로드된 경우
    if (window.PaymentWidget) {
      resolve();
      return;
    }
    
    // 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment-widget';
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('토스 페이먼츠 스크립트 로드 실패'));
    
    document.body.appendChild(script);
  });
};
