import { CardPayment, PaymentLedger } from '../types/payment.types';
import { apiService } from './api';

// 결제 승인 요청 중복 방지를 위한 Map
const processingPayments = new Map<string, boolean>();

// 결제 승인
export const confirmPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<CardPayment> => {
  // 이미 처리 중인지 확인
  if (processingPayments.has(paymentKey)) {
    console.warn(`결제 키 ${paymentKey}는 이미 처리 중입니다.`);
    
    // 대기 후 재시도 대신 직전 요청이 완료될 때까지 기다리는 Promise 반환
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (!processingPayments.has(paymentKey)) {
          clearInterval(checkInterval);
          // 이미 처리되었으므로 API 호출 없이 성공 반환
          resolve({ success: true } as any);
        }
      }, 500);
      
      // 10초 후에도 처리 안되면 타임아웃
      setTimeout(() => {
        clearInterval(checkInterval);
        if (processingPayments.has(paymentKey)) {
          processingPayments.delete(paymentKey);
          reject(new Error('결제 승인 처리 시간이 초과되었습니다.'));
        }
      }, 10000);
    });
  }
  
  // 처리 중 표시
  processingPayments.set(paymentKey, true);
  
  try {
    console.log(`결제 승인 요청: ${paymentKey}, ${orderId}, ${amount}`);
    
    // API 기본 URL을 제거하고 절대 경로로 호출 - POST 메서드 명시
    // 캐시 방지 헤더 추가
    const response = await apiService.post<any>('/confirm', {
      paymentKey,
      orderId,
      amount,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log('결제 승인 응답:', response);
    
    // ApiResponse 구조 처리
    if (response && response.success === true) {
      return response.data;
    }
    return response;
  } catch (error) {
    console.error('결제 승인 실패:', error);
    throw error;
  } finally {
    // 처리 완료 표시 제거
    processingPayments.delete(paymentKey);
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
    // GET 요청 대신 POST 요청으로 변경
    const response = await apiService.post<any>(
      `/api/payments/success`, 
      {
        paymentKey,
        orderId,
        amount,
        paymentType
      }
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
    // 백엔드 API 호출 대신, 프론트엔드에서 로컬 처리만 수행
    console.log('결제 실패 처리:', message);
    // 실제 백엔드 호출이 필요하면 아래 주석을 해제하고 올바른 경로로 수정
    // const response = await apiService.post<any>(`/api/payments/failure`, {
    //   message: message
    // });
    return "failure_handled";
  } catch (error) {
    console.error('결제 실패 처리 오류:', error);
    // 에러가 발생해도 사용자 경험을 위해 계속 진행
    return "failure_handled";
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
    // if (window.PaymentWidget) {
    //   resolve();
    //   return;
    // }
    
    // 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment-widget';
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('토스 페이먼츠 스크립트 로드 실패'));
    
    document.body.appendChild(script);
  });
};
