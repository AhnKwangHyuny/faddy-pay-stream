// features/orders/pages/OrdersListPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Layout } from '../../../shared/components/layout/Layout';
import { OrderList } from '../components/OrderList';
import { useOrders } from '../hooks/useOrders';
import { PageTitle } from '../../../shared/components/common/PageTitle';
import { Spinner } from '../../../shared/components/ui/Spinner';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
`;

export const OrdersListPage: React.FC = () => {
  const {
    orders,
    loading,
    error,
    hasMore,
    page,
    setPage,
    refetch,
  } = useOrders();
  
  const handleLoadMore = () => {
    setPage(page + 1);
  };
  
  return (
    <Layout>
      <Container>
        <PageTitle>주문 내역</PageTitle>
        
        {loading && page === 1 ? (
          <LoadingContainer>
            <Spinner size="large" />
          </LoadingContainer>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>주문 내역을 불러오는 중 오류가 발생했습니다.</p>
            <p>{error.message}</p>
          </div>
        ) : (
          <OrderList
            orders={orders}
            loading={loading && page > 1}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        )}
      </Container>
    </Layout>
  );
};