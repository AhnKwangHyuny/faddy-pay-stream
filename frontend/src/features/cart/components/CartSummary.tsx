// features/cart/components/CartSummary.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Cart } from '../types/cart.types';
import { formatPrice } from '../../../shared/utils/formatters';
import { Button } from '../../../shared/components/ui/Button';

interface CartSummaryProps {
  cart: Cart;
  onCheckout: () => void;
}

const SummaryContainer = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 24px;
  position: sticky;
  top: 90px;
`;

const SummaryTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

const SummaryValue = styled.span`
  font-weight: 600;
`;

const TotalRow = styled(SummaryRow)`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const TotalLabel = styled(SummaryLabel)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const TotalValue = styled(SummaryValue)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

const Actions = styled.div`
  margin-top: 24px;
`;

const ContinueShoppingLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;

export const CartSummary: React.FC<CartSummaryProps> = ({ cart, onCheckout }) => {
  // 상품 금액 (할인 전)
  const subtotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  // 할인 금액
  const discount = cart.items.reduce((total, item) => {
    if (item.discountPrice) {
      return total + (item.price - item.discountPrice) * item.quantity;
    }
    return total;
  }, 0);
  
  // 배송비 (10만원 이상 무료배송, 그 외 3천원)
  const shippingCost = cart.totalPrice >= 100000 ? 0 : 3000;
  
  return (
    <SummaryContainer>
      <SummaryTitle>주문 요약</SummaryTitle>
      
      <SummaryRow>
        <SummaryLabel>상품 금액</SummaryLabel>
        <SummaryValue>{formatPrice(subtotal)}</SummaryValue>
      </SummaryRow>
      
      <SummaryRow>
        <SummaryLabel>할인 금액</SummaryLabel>
        <SummaryValue style={{ color: '#dc3545' }}>
          {discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0)}
        </SummaryValue>
      </SummaryRow>
      
      <SummaryRow>
        <SummaryLabel>배송비</SummaryLabel>
        <SummaryValue>
          {shippingCost > 0 ? formatPrice(shippingCost) : '무료배송'}
        </SummaryValue>
      </SummaryRow>
      
      {shippingCost > 0 && (
        <SummaryRow style={{ fontSize: '14px', marginTop: '-8px' }}>
          <SummaryLabel style={{ fontStyle: 'italic' }}>
            {formatPrice(100000 - cart.totalPrice)} 추가 구매 시 무료배송
          </SummaryLabel>
        </SummaryRow>
      )}
      
      <TotalRow>
        <TotalLabel>총 결제 금액</TotalLabel>
        <TotalValue>{formatPrice(cart.totalPrice + shippingCost)}</TotalValue>
      </TotalRow>
      
      <Actions>
        <Button
          variant="primary"
          fullWidth
          onClick={onCheckout}
          disabled={cart.items.length === 0}
        >
          {cart.items.length === 0 ? '상품을 담아주세요' : '결제하기'}
        </Button>
        
        <ContinueShoppingLink to="/products">
          쇼핑 계속하기
        </ContinueShoppingLink>
      </Actions>
    </SummaryContainer>
  );
};