// features/orders/components/OrderDetail.tsx
import React from 'react';
import styled from 'styled-components';
import { Order, OrderItem } from '../types/order.types';
import { formatPrice, formatDate, formatPhoneNumber } from '../../../shared/utils/formatters';
import { OrderStatus } from './OrderStatus';
import { OrderCancellation } from './OrderCancellation';
import { Button } from '../../../shared/components/ui/Button';
import { Link } from 'react-router-dom';

interface OrderDetailProps {
  order: Order;
  onCancelOrder: (reason: string) => Promise<boolean>;
  onRequestRefund: (
    reason: string,
    items?: { productId: string; quantity: number }[]
  ) => Promise<boolean>;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Section = styled.section`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  margin-bottom: 16px;
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-weight: 500;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 20px 0;
`;

const OrderItemsList = styled.div``;

const ItemRow = styled.div`
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 12px;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.sm};
  margin-right: 16px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 60px;
    height: 60px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const ItemDetails = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  text-align: right;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    text-align: left;
  }
`;

const TotalSummary = styled.div`
  margin-top: 20px;
  background-color: ${({ theme }) => theme.colors.secondaryLight};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 8px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: 600;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

// 주문 상태에 따라 가능한 액션 확인
const canCancelOrder = (status: Order['orderState']): boolean => {
  return ['CREATED', 'PENDING_PAYMENT', 'PAID'].includes(status);
};

const canRequestRefund = (status: Order['orderState']): boolean => {
  return ['DELIVERED', 'COMPLETED'].includes(status);
};

export const OrderDetail: React.FC<OrderDetailProps> = ({
  order,
  onCancelOrder,
  onRequestRefund,
}) => {
  const [showCancellationModal, setShowCancellationModal] = React.useState(false);
  const [showRefundModal, setShowRefundModal] = React.useState(false);
  
  return (
    <Container>
      <Section>
        <SectionTitle>
          주문 정보
          <OrderStatus status={order.orderState} />
        </SectionTitle>
        
        <OrderInfoGrid>
          <InfoItem>
            <InfoLabel>주문 번호</InfoLabel>
            <InfoValue>{order.orderId}</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>주문 일시</InfoLabel>
            <InfoValue>{formatDate(order.createdAt)}</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>수령인</InfoLabel>
            <InfoValue>{order.name}</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>연락처</InfoLabel>
            <InfoValue>{formatPhoneNumber(order.phoneNumber)}</InfoValue>
          </InfoItem>
          
          {order.paymentId && (
            <InfoItem>
              <InfoLabel>결제 번호</InfoLabel>
              <InfoValue>{order.paymentId}</InfoValue>
            </InfoItem>
          )}
        </OrderInfoGrid>
      </Section>
      
      <Section>
        <SectionTitle>주문 상품</SectionTitle>
        
        <OrderItemsList>
          {order.items.map((item, index) => (
            <ItemRow key={index}>
              <ItemImage
                src={`https://via.placeholder.com/80?text=${encodeURIComponent(item.productName)}`}
                alt={item.productName}
              />
              
              <ItemInfo>
                <ItemName>{item.productName}</ItemName>
                <ItemDetails>
                  사이즈: {item.size} | 수량: {item.quantity}개
                </ItemDetails>
                <ItemDetails>
                  상태: <OrderStatus status={item.status} size="small" />
                </ItemDetails>
              </ItemInfo>
              
              <ItemPrice>
                {formatPrice(item.price * item.quantity)}
              </ItemPrice>
            </ItemRow>
          ))}
        </OrderItemsList>
        
        <TotalSummary>
          <SummaryRow>
            <span>상품 금액</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>배송비</span>
            <span>무료</span>
          </SummaryRow>
          <SummaryRow>
            <span>총 결제 금액</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </SummaryRow>
        </TotalSummary>
        
        <ActionsContainer>
          {canCancelOrder(order.orderState) && (
            <Button
              variant="outline"
              onClick={() => setShowCancellationModal(true)}
            >
              주문 취소
            </Button>
          )}
          
          {canRequestRefund(order.orderState) && (
            <Button
              variant="outline"
              onClick={() => setShowRefundModal(true)}
            >
              환불 요청
            </Button>
          )}
          
          <Button
            as={Link}
            to="/orders"
            variant="text"
          >
            주문 목록으로
          </Button>
        </ActionsContainer>
      </Section>
      
      {/* 주문 취소 모달 */}
      {showCancellationModal && (
        <OrderCancellation
          isOpen={showCancellationModal}
          onClose={() => setShowCancellationModal(false)}
          onSubmit={onCancelOrder}
          type="cancel"
        />
      )}
      
      {/* 환불 요청 모달 */}
      {showRefundModal && (
        <OrderCancellation
          isOpen={showRefundModal}
          onClose={() => setShowRefundModal(false)}
          onSubmit={(reason) => onRequestRefund(reason)}
          type="refund"
        />
      )}
    </Container>
  );
};