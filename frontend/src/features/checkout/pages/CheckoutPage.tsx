// features/checkout/pages/CheckoutPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../../../shared/components/layout/Layout';
import { CheckoutForm } from '../components/CheckoutForm';
import { PageTitle } from '../../../shared/components/common/PageTitle';
import { useCart } from '../../cart/hooks/useCart';

const CheckoutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const CheckoutPage: React.FC = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cart.items.length, navigate]);
  
  return (
    <Layout>
      <CheckoutContainer>
        <PageTitle>결제하기</PageTitle>
        <CheckoutForm cart={cart} />
      </CheckoutContainer>
    </Layout>
  );
};