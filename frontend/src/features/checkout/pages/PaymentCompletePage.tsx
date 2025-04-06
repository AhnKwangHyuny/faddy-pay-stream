// features/checkout/pages/PaymentCompletePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../../../shared/components/layout/Layout';
import { Button } from '../../../shared/components/ui/Button';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { verifyPayment } from '../services/checkoutApi';
import { Order } from '../../orders/types/order.types';
import { formatPrice, formatDate } from '../../../shared/utils/formatters';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const OrderDetails = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
`;

const OrderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const OrderLabel = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

const OrderValue = styled.span`
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 16px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const PaymentCompletePage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const orderId = searchParams.get('orderId');
  const paymentKey = searchParams.get('paymentKey');
  const amount = searchParams.get('amount');
  
  useEffect(() => {
    const verifyOrder = async () => {
      if (!orderId) {
        setError('주문 정보를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }
      
      try {
        // URL 파라미터로 전달된 결제 정보로 결제 검증
        if (paymentKey && amount) {
          const verifiedOrder = await verifyPayment(
            paymentKey,
            orderId,
            parseInt(amount, 10)
          );
          setOrder(verifiedOrder);
        } else {
          // 직접 주문 정보 조회 (결제 완료 후 페이지 새로고침 등의 경우)
          // 예시 코드이므로 실제 구현 필요
          setError('결제 정보가 유효하지 않습니다.');
        }
      } catch (err) {
        setError('결제 확인 중 오류가 발생했습니다.');
        console.error('결제 확인 오류:', err);
      } finally {
        setLoading(false);
      }
    };
    
    verifyOrder();
  }, [orderId, paymentKey, amount]);
  
  if (loading) {
    return (
      <Layout>
        <Container>
          <Spinner size="large" />
          <Message>결제 확인 중입니다...</Message>
        </Container>
      </Layout>
    );
  }
  
  if (error || !order) {
    return (
      <Layout>
        <Container>
          <Title>결제 확인 오류</Title>
          <Message>{error || '주문 정보를 불러올 수 없습니다.'}</Message>
          <ButtonGroup>
            <Button variant="primary" onClick={() => navigate('/orders')}>
              주문 내역으로 이동
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              쇼핑 계속하기
            </Button>
          </ButtonGroup>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Container>
        <SuccessIcon>✅</SuccessIcon>
        <Title>결제가 완료되었습니다</Title>
        <Message>
          주문이 성공적으로 완료되었습니다. 배송 상태는 주문 내역에서 확인하실 수 있습니다.
        </Message>
        
        <OrderDetails>
          <OrderRow>
            <OrderLabel>주문 번호</OrderLabel>
            <OrderValue>{order.orderId}</OrderValue>
          </OrderRow>
          <OrderRow>
            <OrderLabel>주문 일시</OrderLabel>
            <OrderValue>{formatDate(order.createdAt)}</OrderValue>
          </OrderRow>
          <OrderRow>
            <OrderLabel>주문 상태</OrderLabel>
            <OrderValue>{order.orderState === 'PAID' ? '결제 완료' : order.orderState}</OrderValue>
          </OrderRow>
          
          <Divider />
          
          <OrderRow>
            <OrderLabel>상품 수량</OrderLabel>
            <OrderValue>{order.items.length}개 상품</OrderValue>
          </OrderRow>
          <OrderRow>
            <OrderLabel>총 결제 금액</OrderLabel>
            <OrderValue style={{ color: '#0066ff' }}>{formatPrice(order.totalPrice)}</OrderValue>
          </OrderRow>
        </OrderDetails>
        
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() => navigate(`/orders/${order.orderId}`)}
          >
            주문 상세 보기
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            쇼핑 계속하기
          </Button>
        </ButtonGroup>
      </Container>
    </Layout>
  );
};