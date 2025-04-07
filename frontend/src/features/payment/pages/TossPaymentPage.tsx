import React from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { TossPaymentWidget } from '../components/TossPaymentWidget';

const PaymentPageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const PaymentTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
`;

export const TossPaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // URL 파라미터에서 결제 정보 추출
  const paymentProps = {
    orderId: searchParams.get('orderId') || '',
    userId: searchParams.get('userId') || '',
    ordererName: searchParams.get('ordererName') || '',
    ordererPhoneNumber: searchParams.get('ordererPhoneNumber') || '',
    orderName: searchParams.get('orderName') || '',
    amount: Number(searchParams.get('amount')) || 0,
  };

  return (
    <PaymentPageContainer>
      <PaymentTitle>결제하기</PaymentTitle>
      <TossPaymentWidget {...paymentProps} />
    </PaymentPageContainer>
  );
}; 