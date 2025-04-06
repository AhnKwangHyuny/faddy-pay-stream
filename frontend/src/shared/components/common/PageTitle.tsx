// shared/components/common/PageTitle.tsx
import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: 24px;
  text-align: center;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }
`;

export const PageTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Title>{children}</Title>;
};