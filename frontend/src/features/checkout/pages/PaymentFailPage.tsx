import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Layout } from '../../../shared/components/layout/Layout';
import { Button } from '../../../shared/components/ui/Button';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.danger};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.danger};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const PaymentFailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');
  
  return (
    <Layout>
      <Container>
        <ErrorIcon>❌</ErrorIcon>
        <Title>결제에 실패했습니다</Title>
        <Message>
          {errorMessage || '결제 중 오류가 발생했습니다. 다시 시도해 주세요.'}
          {errorCode && ` (오류 코드: ${errorCode})`}
        </Message>
        
        <ButtonGroup>
          <Button variant="primary" onClick={() => navigate('/checkout')}>
            결제 다시 시도
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            쇼핑 계속하기
          </Button>
        </ButtonGroup>
      </Container>
    </Layout>
  );
};

export default PaymentFailPage; 