import { apiService } from './api';

/**
 * 주문 취소 API 호출 함수
 * 
 * @param orderId 주문 ID
 * @param paymentKey 결제 키
 * @param cancelReason 취소 사유
 * @param itemIdxs 취소할 항목 인덱스 배열 (빈 배열이면 전체 취소)
 * @param cancellationAmount 취소 금액
 * @returns 성공 여부
 */
export const cancelOrder = async (
  orderId: string,
  paymentKey: string,
  cancelReason: string = "고객 요청에 의한 주문 취소",
  itemIdxs: number[] = [],
  cancellationAmount: number = 0
): Promise<boolean> => {
  try {
    console.log(`결제 취소 요청: 주문 ID=${orderId}, 결제 키=${paymentKey}`);
    
    // 0x 접두사 제거
    if (orderId.startsWith('0x')) {
      console.log('0x 접두사가 있는 주문 ID 감지, 변환 중');
      orderId = orderId.substring(2);
    }
    
    // 취소 요청 데이터 구성
    const cancelData = {
      orderId: orderId,
      itemIdxs: itemIdxs,
      cancelReason: cancelReason,
      paymentKey: paymentKey,
      cancellationAmount: cancellationAmount
    };
    
    console.log('취소 요청 데이터:', cancelData);
    
    // 결제 취소 API 호출
    const response = await apiService.post<any>('/cancel/payment', cancelData);
    
    console.log('취소 API 응답:', response);
    
    // ApiResponse 형식 확인
    if (response && typeof response === 'object') {
      if ('success' in response) {
        if (response.success) {
          console.log('취소 처리 성공:', response.data);
          return true;
        } else {
          console.error('취소 처리 실패:', response.message);
          throw new Error(response.message || '취소 처리 실패');
        }
      } else if ('cancelled' in response) {
        // 직접 cancelled 필드를 반환하는 경우
        return response.cancelled === true;
      }
      
      // 오래된 API 형식으로 boolean을 직접 반환하는 경우
      return !!response;
    }
    
    // 응답이 예상과 다른 경우
    console.warn('예상치 못한 응답 형식:', response);
    return false;
  } catch (error: any) {
    console.error(`결제 취소 요청 실패: ${orderId}`, error);
    // 오류 메시지 추출
    const errorMessage = error?.response?.data?.message || 
                         error?.message || 
                         '결제 취소 처리 중 오류가 발생했습니다';
    throw new Error(errorMessage);
  }
};