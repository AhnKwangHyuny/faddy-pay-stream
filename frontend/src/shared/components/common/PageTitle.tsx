// shared/components/common/PageTitle.tsx
import React from 'react';
import styled from 'styled-components';

interface PageTitleProps {
  children: React.ReactNode;
  subtitle?: string;
}

const TitleContainer = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: 8px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textLight};
`;

export const PageTitle: React.FC<PageTitleProps> = ({ children, subtitle }) => {
  return (
    <TitleContainer>
      <Title>{children}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </TitleContainer>
  );
};