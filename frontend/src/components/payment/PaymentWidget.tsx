import React, { useEffect, useState, useRef } from 'react';
import { Order } from '../../types/order.types';

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
    // Load Toss Payments SDK
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment-widget';
    script.async = true;
    
    script.onload = () => {
      if (window.PaymentWidget) {
        try {
          const paymentWidget = window.PaymentWidget(
            clientKey,
            order.name || '고객' // Customer identifier
          );
          
          setWidget(paymentWidget);
          setLoading(false);
        } catch (error) {
          console.error('Failed to initialize payment widget:', error);
          setLoading(false);
        }
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load payment widget script');
      setLoading(false);
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [clientKey, order.name]);
  
  // Initialize payment method widget when widget is loaded and container is available
  useEffect(() => {
    if (widget && paymentMethodRef.current && agreementRef.current) {
      try {
        // Render payment methods
        const methodWidget = widget.renderPaymentMethods(
          '#payment-method-container',
          { value: order.totalPrice },
          { variantKey: 'DEFAULT' }
        );
        
        setPaymentMethodWidget(methodWidget);
        
        // Render agreement
        widget.renderAgreement('#agreement-container', { variantKey: 'AGREEMENT' });
        
        setIsPaymentReady(true);
      } catch (error) {
        console.error('Failed to render payment UI:', error);
      }
    }
  }, [widget, order.totalPrice]);
  
  // Update amount when coupon state changes
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
    
    try {
      await widget.requestPayment({
        orderId: order.orderId,
        orderName: order.items.map(item => item.productName).join(', ').substring(0, 80), // Limit to 80 chars
        customerEmail: 'customer@example.com', // You might want to get this from the user
        customerName: order.name,
        customerMobilePhone: order.phoneNumber,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        amount: finalAmount
      });
    } catch (error: any) {
      console.error('Payment request failed:', error);
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