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

    // 요청 데이터 구성 - 백엔드 필드명과 호환되도록 수정
    const requestData = {
      orderId: orderId,
      cancelReason: cancelData.cancellationReason || "고객 요청에 의한 취소",
      cancellationItems: cancelData.cancellationItems || "전체",
      paymentKey: cancelData.paymentKey || `임시_결제키_${orderId}`,
      cancellationAmount: cancelData.cancellationAmount || 0
    };

    console.log('요청 데이터:', JSON.stringify(requestData, null, 2));
    console.log('요청 URL: /cancel/payment');

    // API 요청 - 헤더 명시적으로 지정 및 로깅 추가
    let response;
    try {
      console.log('POST 요청 전송 중 - URL: /cancel/payment');
      console.log('요청 데이터 최종:', JSON.stringify(requestData, null, 2));

      response = await apiService.post<any>('/cancel/payment', requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('결제 취소 응답:', response);
    } catch (apiError) {
      console.error('API 오류:', apiError);

      // 백업 경로 시도
      console.log('백업 경로 시도: /api/cancel/payment');
      try {
        response = await apiService.post<any>('/api/cancel/payment', requestData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log('백업 경로 응답:', response);
      } catch (backupError) {
        console.error('백업 경로도 실패:', backupError);
        throw backupError;
      }
    }

    // 응답 처리 - 백엔드 응답 구조에 맞게 수정
    const responseData = response.data;
    console.log('백엔드 응답 데이터:', responseData);

    // 백엔드 응답 구조에 따라 처리 로직 수정
    if (responseData && (responseData.success === true ||
        (responseData.data && responseData.data.success === true))) {
      // 백엔드 응답을 CancelOrderResponse 형식으로 변환
      return {
        cancelled: true, // 백엔드의 success를 cancelled에 매핑
        orderId: cancelData.orderId,
        paymentKey: cancelData.paymentKey,
        cancellationAmount: cancelData.cancellationAmount
      };
    }

    // 취소 실패 처리
    throw new Error(
        (responseData && responseData.message) ||
        (responseData && responseData.data && responseData.data.message) ||
        '결제 취소에 실패했습니다.'
    );
  } catch (error: any) {
    console.error('결제 취소 요청 실패:', error);

    // 에러 메시지 출력 (디버깅용)
    if (error.response) {
      console.error('에러 응답:', error.response);
    }

    throw error;
  }
};