// features/checkout/components/OrderSummary.tsx
import React from 'react';
import styled from 'styled-components';
import { Cart } from '../../cart/types/cart.types';
import { formatPrice } from '../../../shared/utils/formatters';

interface OrderSummaryProps {
  cart: Cart;
}

const SummaryContainer = styled.div`
  margin: 24px 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.secondaryLight};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const SummaryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: 16px;
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:not(:last-child) td {
    padding-bottom: 8px;
  }
`;

const TableCell = styled.td`
  padding: 4px 0;
  
  &:first-child {
    color: ${({ theme }) => theme.colors.textLight};
  }
  
  &:last-child {
    text-align: right;
    font-weight: 500;
  }
`;

const TotalRow = styled(TableRow)`
  font-weight: 600;
  
  td {
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  td:last-child {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const ItemsList = styled.ul`
  margin-top: 16px;
  padding-left: 16px;
`;

const ItemRow = styled.li`
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cart }) => {
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
  
  // 최종 결제 금액
  const total = cart.totalPrice + shippingCost;
  
  return (
    <SummaryContainer>
      <SummaryTitle>주문 요약</SummaryTitle>
      
      <SummaryTable>
        <tbody>
          <TableRow>
            <TableCell>상품 금액</TableCell>
            <TableCell>{formatPrice(subtotal)}</TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell>할인 금액</TableCell>
            <TableCell>- {formatPrice(discount)}</TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell>배송비</TableCell>
            <TableCell>
              {shippingCost === 0 ? '무료' : formatPrice(shippingCost)}
            </TableCell>
          </TableRow>
          
          <TotalRow>
            <TableCell>총 결제 금액</TableCell>
            <TableCell>{formatPrice(total)}</TableCell>
          </TotalRow>
        </tbody>
      </SummaryTable>
      
      <ItemsList>
        {cart.items.map((item, index) => (
          <ItemRow key={index}>
            {item.productName} ({item.size}) x {item.quantity}개: 
            {item.discountPrice
              ? formatPrice(item.discountPrice * item.quantity)
              : formatPrice(item.price * item.quantity)}
          </ItemRow>
        ))}
      </ItemsList>
    </SummaryContainer>
  );
};