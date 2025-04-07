import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const PaymentCompletePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>결제가 완료되었습니다</Title>
      <Message>주문이 성공적으로 처리되었습니다.</Message>
      <Button onClick={() => navigate('/orders')}>
        주문 내역 보기
      </Button>
    </Container>
  );
};

export default PaymentCompletePage; 