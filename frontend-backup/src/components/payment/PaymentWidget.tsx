import React, { useState, useEffect } from 'react';
import { Order } from '../../types/order.types';

interface PaymentWidgetProps {
  order: Order;
  clientKey: string;
  onPaymentSuccess: (paymentKey: string, orderId: string, amount: number) => void;
  onPaymentFail: (code: string, message: string) => void;
}

const PaymentWidget: React.FC<PaymentWidgetProps> = ({
  order,
  clientKey,
  onPaymentSuccess,
  onPaymentFail
}) => {
  console.log("order widget", order);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate the total price based on coupon application
  const calculateTotalPrice = () => {
    return couponApplied ? order.totalPrice - 5000 : order.totalPrice;
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponApplied(e.target.checked);
  };
  
  const handlePaymentClick = () => {
    const finalAmount = calculateTotalPrice();
    console.log('최종 결제 금액:', finalAmount);
    console.log('주문 정보:', order);
    
    // 백엔드의 API 기본 URL
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
    
    // 주문 아이템 확인 및 주문명 생성
    const orderName = order.items && order.items.length > 0
      ? (order.items.length > 1 
          ? `${order.items[0].productName} 외 ${order.items.length - 1}건` 
          : order.items[0].productName)
      : '상품 주문';
    
    // URL에 모든 필요한 파라미터 포함
    const checkoutUrl = `${apiBaseUrl}/payment/checkout/${order.orderId}?` + 
      `orderId=${encodeURIComponent(order.orderId)}` +
      `&userId=${encodeURIComponent('faddy')}` +
      `&ordererName=${encodeURIComponent(order.name)}` +
      `&ordererPhoneNumber=${encodeURIComponent(order.phoneNumber)}` +
      `&orderName=${encodeURIComponent(orderName)}` +
      `&amount=${encodeURIComponent(finalAmount.toString())}`;
    
    console.log('리다이렉트 URL:', checkoutUrl);
    
    // 결제 페이지로 이동
    window.location.href = checkoutUrl;
  };
  
  if (loading) {
    return (
      <div className="payment-widget-container p-6 bg-white rounded-lg shadow">
        <div className="text-center py-10">
          <svg className="animate-spin h-10 w-10 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">결제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="payment-widget-container p-6 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-6">결제 정보</h2>
      
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
      
      {/* Payment Button */}
      <button
        type="button"
        className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        onClick={handlePaymentClick}
      >
        {calculateTotalPrice().toLocaleString()}원 결제하기
      </button>
    </div>
  );
};

export default PaymentWidget;