import React from 'react';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const ErrorCode = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.colors.light : theme.colors.primary};
  color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.colors.text : 'white'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:hover {
    background-color: ${({ theme, variant }) => 
      variant === 'secondary' ? theme.colors.border : theme.colors.primaryDark};
  }
`;

export const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const code = searchParams.get('code') || '알 수 없는 오류';
  const message = searchParams.get('message') || '결제 처리 중 오류가 발생했습니다.';

  return (
    <Container>
      <Title>결제에 실패했습니다</Title>
      <Message>{message}</Message>
      <ErrorCode>오류 코드: {code}</ErrorCode>
      <ButtonGroup>
        <Button onClick={() => navigate('/checkout')}>
          다시 시도하기
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          쇼핑 계속하기
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default PaymentFailPage; 