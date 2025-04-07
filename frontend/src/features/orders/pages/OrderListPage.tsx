import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin: 3rem 0;
`;

export const OrderListPage = () => {
  return (
    <Container>
      <Title>주문 내역</Title>
      <EmptyMessage>주문 내역이 없습니다.</EmptyMessage>
    </Container>
  );
};

export default OrderListPage; 