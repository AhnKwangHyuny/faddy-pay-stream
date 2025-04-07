import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

// 스타일 컴포넌트
const PaymentMethodContainer = styled.div`
  margin-bottom: 24px;
`;

const AgreementContainer = styled.div`
  margin-bottom: 24px;
`;

const CouponContainer = styled.div`
  margin-bottom: 24px;
  padding-left: 25px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const CheckboxInput = styled.input`
  margin-right: 8px;
`;

const PaymentButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 30px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

interface TossPaymentWidgetProps {
  orderId: string;
  userId: string;
  ordererName: string;
  ordererPhoneNumber: string;
  orderName: string;
  amount: number;
}

// 토스페이먼츠 타입 정의
interface PaymentWidgetInstance {
  renderPaymentMethods: (
    selector: string,
    options: { value: number },
    widgetOptions?: { variantKey: string }
  ) => PaymentMethodWidgetInstance;
  renderAgreement: (
    selector: string,
    options?: { variantKey: string }
  ) => void;
  requestPayment: (options: PaymentRequestOptions) => Promise<void>;
}

interface PaymentMethodWidgetInstance {
  updateAmount: (amount: number) => void;
}

interface PaymentRequestOptions {
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerEmail?: string;
  customerName?: string;
  customerMobilePhone?: string;
}

// window에 PaymentWidget 타입 추가
declare global {
  interface Window {
    PaymentWidget: (clientKey: string, customerKey: string | "ANONYMOUS") => PaymentWidgetInstance;
  }
}

export const TossPaymentWidget: React.FC<TossPaymentWidgetProps> = ({
  orderId,
  userId,
  ordererName,
  ordererPhoneNumber,
  orderName,
  amount,
}) => {
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const paymentMethodWidgetRef = useRef<PaymentMethodWidgetInstance | null>(null);
  
  // 토스페이먼츠 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment-widget';
    script.async = true;
    script.onload = () => {
      setIsLoading(false);
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // 결제 위젯 초기화
  useEffect(() => {
    if (isLoading) return;
    
    try {
      const widgetClientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'; // 테스트 키 (실제 서비스에서는 환경변수로 관리)
      const customerKey = userId; // 사용자 고유 ID
      
      const paymentWidget = window.PaymentWidget(widgetClientKey, customerKey);
      
      // 결제 UI 렌더링
      const paymentMethodWidget = paymentWidget.renderPaymentMethods(
        '#payment-method',
        { value: amount },
        { variantKey: 'DEFAULT' }
      );
      
      // 이용약관 UI 렌더링
      paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });
      
      // 결제 버튼 이벤트 리스너
      const handlePaymentRequest = () => {
        paymentWidget.requestPayment({
          orderId: orderId,
          orderName: orderName,
          successUrl: `${window.location.origin}/payment/complete`,
          failUrl: `${window.location.origin}/payment/fail`,
          customerEmail: 'fastcamp-y@gmail.com', // 실제 구현 시 사용자 이메일을 동적으로 가져와야 함
          customerName: ordererName,
          customerMobilePhone: ordererPhoneNumber,
        });
      };
      
      // 결제 버튼 참조
      const paymentButton = document.getElementById('payment-button');
      if (paymentButton) {
        paymentButton.addEventListener('click', handlePaymentRequest);
      }
      
      // Ref 저장
      paymentMethodWidgetRef.current = paymentMethodWidget;
      
      return () => {
        if (paymentButton) {
          paymentButton.removeEventListener('click', handlePaymentRequest);
        }
      };
    } catch (error) {
      console.error('결제 위젯 초기화 오류:', error);
    }
  }, [isLoading, orderId, userId, ordererName, ordererPhoneNumber, orderName, amount]);
  
  // 쿠폰 적용 시 금액 업데이트
  useEffect(() => {
    if (paymentMethodWidgetRef.current) {
      const discountAmount = isCouponApplied ? 5000 : 0;
      paymentMethodWidgetRef.current.updateAmount(amount - discountAmount);
    }
  }, [isCouponApplied, amount]);
  
  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCouponApplied(e.target.checked);
  };
  
  return (
    <>
      {/* 결제 UI */}
      <PaymentMethodContainer id="payment-method" />
      
      {/* 이용약관 UI */}
      <AgreementContainer id="agreement" />
      
      {/* 쿠폰 체크박스 */}
      <CouponContainer>
        <CheckboxLabel htmlFor="coupon-box">
          <CheckboxInput
            id="coupon-box"
            type="checkbox"
            checked={isCouponApplied}
            onChange={handleCouponChange}
          />
          <span>5,000원 쿠폰 적용</span>
        </CheckboxLabel>
      </CouponContainer>
      
      {/* 결제하기 버튼 */}
      <PaymentButton id="payment-button" disabled={isLoading}>
        결제하기
      </PaymentButton>
    </>
  );
}; 