// features/orders/components/OrderList.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Order } from '../types/order.types';
import { formatPrice, formatDate } from '../../../shared/utils/formatters';
import { OrderStatus } from './OrderStatus';
import { Button } from '../../../shared/components/ui/Button';

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OrderCard = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderDate = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
`;

const OrderId = styled.span`
  font-weight: 600;
`;

const OrderContent = styled.div`
  padding: 16px;
`;

const OrderItemsList = styled.div`
  margin-bottom: 16px;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.sm};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ItemDetails = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.secondaryLight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 12px;
  }
`;

const OrderTotal = styled.div`
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    align-self: flex-start;
  }
`;

const OrderActions = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 24px;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading,
  onLoadMore,
  hasMore,
}) => {
  if (orders.length === 0 && !loading) {
    return (
      <EmptyState>
        <EmptyTitle>주문 내역이 없습니다</EmptyTitle>
        <EmptyText>
          아직 주문한 상품이 없습니다. 새로운 상품을 쇼핑해보세요!
        </EmptyText>
        <Button as={Link} to="/products" variant="primary">
          쇼핑하러 가기
        </Button>
      </EmptyState>
    );
  }
  
  return (
    <OrdersContainer>
      {orders.map((order) => (
        <OrderCard key={order.orderId}>
          <OrderHeader>
            <OrderInfo>
              <OrderDate>{formatDate(order.createdAt)}</OrderDate>
              <OrderId>주문번호: {order.orderId}</OrderId>
            </OrderInfo>
            <OrderStatus status={order.orderState} />
          </OrderHeader>
          
          <OrderContent>
            <OrderItemsList>
              {order.items.slice(0, 2).map((item, index) => (
                <OrderItem key={index}>
                  <ItemImage src={`https://via.placeholder.com/60?text=${encodeURIComponent(item.productName)}`} alt={item.productName} />
                  <ItemInfo>
                    <ItemName>{item.productName}</ItemName>
                    <ItemDetails>
                      {formatPrice(item.price)} | 사이즈: {item.size} | {item.quantity}개
                    </ItemDetails>
                  </ItemInfo>
                </OrderItem>
              ))}
              {order.items.length > 2 && (
                <ItemDetails style={{ marginTop: '8px' }}>
                  외 {order.items.length - 2}개 상품
                </ItemDetails>
              )}
            </OrderItemsList>
          </OrderContent>
          
          <OrderFooter>
            <OrderTotal>총 {formatPrice(order.totalPrice)}</OrderTotal>
            <OrderActions>
              <Button
                as={Link}
                to={`/orders/${order.orderId}`}
                variant="outline"
                size="small"
              >
                주문 상세
              </Button>
            </OrderActions>
          </OrderFooter>
        </OrderCard>
      ))}
      
      {hasMore && (
        <LoadMoreContainer>
          <Button
            variant="outline"
            onClick={onLoadMore}
            isLoading={loading}
          >
            더 보기
          </Button>
        </LoadMoreContainer>
      )}
    </OrdersContainer>
  );
};