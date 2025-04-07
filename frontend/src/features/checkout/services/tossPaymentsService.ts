// features/checkout/services/tossPaymentsService.ts
import { PaymentRequest } from '../types/checkout.types';

/**
 * 토스페이먼츠 결제 처리 함수
 * 
 * 결제 요청 정보를 받아 토스페이먼츠 결제 페이지로 리다이렉트
 * @param request 결제 요청 정보
 */
export const processPayment = async (request: PaymentRequest): Promise<void> => {
  const {
    orderId,
    amount,
    orderName,
    customerName,
    successUrl,
    failUrl
  } = request;
  
  // 본래는 API를 통해 서버에서 결제 요청을 생성하고 결제 정보를 받아와야 함
  // 여기서는 예시로 URL 파라미터를 직접 구성
  
  // URL 인코딩
  const encodedOrderName = encodeURIComponent(orderName);
  const encodedCustomerName = encodeURIComponent(customerName);
  
  // 토스페이먼츠 결제 위젯 페이지로 리다이렉트
  const redirectUrl = `/payment/checkout?orderId=${orderId}&userId=fastcamp-y&ordererName=${encodedCustomerName}&ordererPhoneNumber=01012341234&orderName=${encodedOrderName}&amount=${amount}`;
  
  // 페이지 이동
  window.location.href = redirectUrl;
};