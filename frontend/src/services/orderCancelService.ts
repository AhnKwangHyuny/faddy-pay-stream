import { apiService } from './api';
import { ensureUuid } from '../utils/helpers';

// 취소 요청 인터페이스
export interface CancelOrderRequest {
  orderId: string;            // 주문 ID (UUID)
  cancellationReason: string; // 취소 사유
  cancellationItems: string;  // 취소 항목 (ex: "전체", "부분 - 상품명")
  paymentKey: string;         // 결제 키
  cancellationAmount: number; // 취소 금액
}

// 취소 응답 인터페이스
export interface CancelOrderResponse {
  cancelled: boolean;       // 취소 성공 여부
  orderId: string;          // 주문 ID
  paymentKey: string;       // 결제 키
  cancellationAmount: number; // 취소 금액
}

/**
 * 결제 취소 요청
 * @param cancelData 취소 요청 데이터
 * @returns 취소 결과
 */
export const cancelPayment = async (cancelData: CancelOrderRequest): Promise<CancelOrderResponse> => {
  try {
    console.log('결제 취소 요청 데이터:', cancelData);
    
    // UUID 형식 확인 및 변환
    const orderId = ensureUuid(cancelData.orderId);
    console.log('변환된 UUID:', orderId);
    
    // 요청 데이터 구성
    const requestData = {
      orderId: orderId,
      cancellationReason: cancelData.cancellationReason,
      cancellationItems: cancelData.cancellationItems,
      paymentKey: cancelData.paymentKey,
      cancellationAmount: cancelData.cancellationAmount
    };
    
    console.log('요청 데이터:', JSON.stringify(requestData, null, 2));
    console.log('요청 URL: /cancel/payment');
    
    // API 요청
    let response;
    try {
      response = await apiService.post<any>('/cancel/payment', requestData);
      console.log('결제 취소 응답:', response);
    } catch (apiError) {
      console.error('API 오류:', apiError);
      
      // 백업 경로 시도
      console.log('백업 경로 시도: /api/cancel/payment');
      try {
        response = await apiService.post<any>('/api/cancel/payment', requestData);
        console.log('백업 경로 응답:', response);
      } catch (backupError) {
        console.error('백업 경로도 실패:', backupError);
        throw backupError;
      }
    }
    
    // 응답 처리
    if (response && response.success && response.data) {
      return response.data as CancelOrderResponse;
    } else if (response && response.cancelled !== undefined) {
      // 직접 CancelOrderResponse 형식으로 변환
      return {
        cancelled: response.cancelled,
        orderId: response.orderId || cancelData.orderId,
        paymentKey: response.paymentKey || cancelData.paymentKey,
        cancellationAmount: response.cancellationAmount || cancelData.cancellationAmount
      };
    }
    
    throw new Error(response?.message || '결제 취소에 실패했습니다.');
  } catch (error: any) {
    console.error('결제 취소 요청 실패:', error);
    
    // 에러 메시지 출력 (디버깅용)
    if (error.response) {
      console.error('에러 응답:', error.response);
    }
    
    throw error;
  }
};
