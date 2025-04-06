// features/orders/pages/OrderDetailPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../../../shared/components/layout/Layout';
import { OrderDetail } from '../components/OrderDetail';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { PageTitle } from '../../../shared/components/common/PageTitle';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Button } from '../../../shared/components/ui/Button';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px;
`;

export const OrderDetailPage: React.FC = () => {
  const { orderId = '' } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const {
    order,
    loading,
    error,
    cancelOrderRequest,
    requestRefundRequest,
  } = useOrderDetail(orderId);
  
  return (
    <Layout>
      <Container>
        <PageTitle>주문 상세</PageTitle>
        
        {loading ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <p>주문 정보를 불러오는 중 오류가 발생했습니다.</p>
            <p>{error.message}</p>
            <Button
              variant="outline"
              onClick={() => navigate('/orders')}
              style={{ marginTop: '16px' }}
            >
              주문 목록으로
            </Button>
          </ErrorContainer>
        ) : order ? (
          <OrderDetail
            order={order}
            onCancelOrder={cancelOrderRequest}
            onRequestRefund={requestRefundRequest}
          />
        ) : (
          <ErrorContainer>
            <p>주문 정보를 찾을 수 없습니다.</p>
            <Button
              variant="outline"
              onClick={() => navigate('/orders')}
              style={{ marginTop: '16px' }}
            >
              주문 목록으로
            </Button>
          </ErrorContainer>
        )}
      </Container>
    </Layout>
  );
};