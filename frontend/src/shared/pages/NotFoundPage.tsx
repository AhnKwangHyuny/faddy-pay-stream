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
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textLight};
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

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>404</Title>
      <Message>요청하신 페이지를 찾을 수 없습니다.</Message>
      <Button onClick={() => navigate('/')}>
        홈으로 돌아가기
      </Button>
    </Container>
  );
};

export default NotFoundPage; 