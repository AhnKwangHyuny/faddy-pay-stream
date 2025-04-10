import React, { useEffect, useState, useRef } from 'react';
import { Order } from '../../types/order.types';
import { loadTossPaymentsWidget } from '../../services/paymentService';
import { v4 as uuidv4 } from 'uuid';

interface PaymentWidgetProps {
  order: Order;
  clientKey: string;
  onPaymentSuccess: (paymentKey: string, orderId: string, amount: number) => void;
  onPaymentFail: (code: string, message: string) => void;
}

declare global {
  interface Window {
    PaymentWidget: any;
  }
}

const PaymentWidget: React.FC<PaymentWidgetProps> = ({
  order,
  clientKey,
  onPaymentSuccess,
  onPaymentFail
}) => {
  console.log("order widget" , order)
  const [widget, setWidget] = useState<any>(null);
  const [paymentMethodWidget, setPaymentMethodWidget] = useState<any>(null);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [isPaymentReady, setIsPaymentReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Use refs to store payment UI container elements
  const paymentMethodRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);
  
  // Calculate the total price based on coupon application
  const calculateTotalPrice = () => {
    return couponApplied ? order.totalPrice - 5000 : order.totalPrice;
  };

  useEffect(() => {
    // 수신한 주문 객체 로깅
    console.log('PaymentWidget에 전달된 주문 객체:', order);
    
    // 토스 페이먼츠 SDK 로드 및 초기화
    const initializePaymentWidget = async () => {
      try {
        await loadTossPaymentsWidget();
        
        if (window.PaymentWidget) {
          // 고객 식별자 생성 (토스페이먼츠 형식 요구사항에 맞게)
          // 영문 대소문자, 숫자, 특수문자(`-`,`_`,`=`,`.`,`@`)만 허용, 2-50자
          const generateValidCustomerKey = () => {
            // 주문 ID를 기본으로 사용
            let key = '';
            
            // 주문 ID가 있으면 사용, 없으면 UUID 생성
            if (order.orderId) {
              key = order.orderId;
            } else {
              key = `order-${uuidv4()}`;
            }
            
            // 유효한 문자만 남기기
            key = key.replace(/[^a-zA-Z0-9\-_=.@]/g, '');
            
            // 길이 체크
            if (key.length < 2) {
              key = `customer-${Date.now()}`;
            }
            
            // 최대 길이 제한
            return key.substring(0, 50);
          };
          
          const customerKey = generateValidCustomerKey();
          console.log('결제 위젯 초기화 - 고객 식별자:', customerKey);
          
          const paymentWidget = window.PaymentWidget(
            clientKey,
            customerKey
          );
          
          setWidget(paymentWidget);
        }
      } catch (error) {
        console.error('결제 위젯 초기화 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initializePaymentWidget();
  }, [clientKey, order.orderId]);
  
  // 결제 위젯이 로드되고 컨테이너가 준비되면 UI 렌더링
  useEffect(() => {
    if (widget && paymentMethodRef.current && agreementRef.current) {
      try {
        // 결제 수단 UI 렌더링
        const methodWidget = widget.renderPaymentMethods(
          '#payment-method-container',
          { value: order.totalPrice },
          { variantKey: 'DEFAULT' }
        );
        
        setPaymentMethodWidget(methodWidget);
        
        // 이용약관 UI 렌더링
        widget.renderAgreement('#agreement-container', { variantKey: 'AGREEMENT' });
        
        setIsPaymentReady(true);
      } catch (error) {
        console.error('결제 UI 렌더링 실패:', error);
      }
    }
  }, [widget, order.totalPrice]);
  
  // 쿠폰 적용 시 결제 금액 업데이트
  useEffect(() => {
    if (paymentMethodWidget) {
      paymentMethodWidget.updateAmount(calculateTotalPrice());
    }
  }, [couponApplied, paymentMethodWidget]);
  
  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponApplied(e.target.checked);
  };
  
  const handlePaymentClick = async () => {
    if (!widget || !isPaymentReady) {
      alert('결제 위젯이 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    const finalAmount = calculateTotalPrice();
    console.log('최종 결제 금액:', finalAmount);
    
    try {
      // API의 기본 URL을 확인 (브라우저 콘솔에 로그)
      console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080');
      
      // 결제 요청 파라미터 - 성공 및 실패 URL이 절대 경로인지 확인
      const successUrl = new URL('/success', window.location.origin).toString();
      const failUrl = new URL('/fail', window.location.origin).toString();
      
      console.log('Success URL:', successUrl);
      console.log('Fail URL:', failUrl);
      
      // 주문 아이템 확인
      console.log('주문 아이템:', order.items);
      const orderName = order.items && order.items.length > 0
        ? (order.items.length > 1 
            ? `${order.items[0].productName} 외 ${order.items.length - 1}건` 
            : order.items[0].productName)
        : '상품 주문';
      
      console.log('결제 요청 정보:', {
        orderId: order.orderId,
        orderName,
        customerEmail: order.email || 'customer@example.com',
        customerName: order.name,
        customerMobilePhone: order.phoneNumber,
        amount: finalAmount
      });
      
      // 결제 요청
      await widget.requestPayment({
        orderId: order.orderId,
        orderName,
        customerEmail: order.email || 'customer@example.com',
        customerName: order.name,
        customerMobilePhone: order.phoneNumber,
        successUrl: successUrl,
        failUrl: failUrl,
        amount: finalAmount
      });
    } catch (error: any) {
      console.error('결제 요청 실패:', error);
      onPaymentFail(error.code || 'UNKNOWN', error.message || '결제 요청 중 오류가 발생했습니다.');
    }
  };
  
  if (loading) {
    return (
      <div className="payment-widget-container p-6 bg-white rounded-lg shadow">
        <div className="text-center py-10">
          <svg className="animate-spin h-10 w-10 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">결제 위젯을 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="payment-widget-container p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-6">결제 정보</h2>
      
      {/* Payment Method Widget */}
      <div className="mb-6">
        <div id="payment-method-container" ref={paymentMethodRef}></div>
      </div>
      
      {/* Coupon */}
      <div className="mb-6 p-4 border border-gray-200 rounded-md">
        <h3 className="text-sm font-medium text-gray-900 mb-3">쿠폰 적용</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-gray-900 rounded border-gray-300"
            checked={couponApplied}
            onChange={handleCouponChange}
          />
          <span className="ml-2 text-sm text-gray-700">첫 구매 5,000원 할인 쿠폰</span>
        </label>
      </div>
      
      {/* Order Summary */}
      <div className="mb-6 bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-900 mb-3">주문 요약</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">상품 금액</span>
            <span>{order.totalPrice.toLocaleString()}원</span>
          </div>
          {couponApplied && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">쿠폰 할인</span>
              <span className="text-red-600">-5,000원</span>
            </div>
          )}
          <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
            <span>최종 결제 금액</span>
            <span className="text-lg">{calculateTotalPrice().toLocaleString()}원</span>
          </div>
        </div>
      </div>
      
      {/* Agreement Widget */}
      <div className="mb-6">
        <div id="agreement-container" ref={agreementRef}></div>
      </div>
      
      {/* Payment Button */}
      <button
        type="button"
        className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handlePaymentClick}
        disabled={!isPaymentReady}
      >
        {calculateTotalPrice().toLocaleString()}원 결제하기
      </button>
    </div>
  );
};

export default PaymentWidget;