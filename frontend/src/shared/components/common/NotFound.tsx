// shared/components/common/NotFound.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Layout } from '../layout/Layout';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
`;

const ErrorCode = styled.h1`
  font-size: 72px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 500px;
  margin-bottom: 32px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const NotFound: React.FC = () => {
  return (
    <Layout>
      <Container>
        <ErrorCode>404</ErrorCode>
        <Title>페이지를 찾을 수 없습니다</Title>
        <Description>
          요청하신 페이지가 존재하지 않거나 다른 URL로 변경되었을 수 있습니다.
          URL을 확인하시거나 아래 버튼을 통해 다른 페이지로 이동해주세요.
        </Description>
        <ButtonsContainer>
          <Button as={Link} to="/" variant="primary">
            홈으로 이동
          </Button>
          <Button as={Link} to="/products" variant="outline">
            상품 목록 보기
          </Button>
        </ButtonsContainer>
      </Container>
    </Layout>
  );
};