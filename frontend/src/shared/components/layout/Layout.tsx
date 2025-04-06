// 14. 레이아웃 컴포넌트
// shared/components/layout/Layout.tsx
import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';
import { useResponsive } from '../../hooks/useResponsive';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

const Main = styled.main`
  min-height: calc(100vh - 140px); // 헤더(70px) + 푸터(70px) 높이를 뺀 값
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 16px;
  }
`;

export const Layout: React.FC<LayoutProps> = ({
  children,
  hideHeader = false,
  hideFooter = false,
}) => {
  const { isMobile } = useResponsive();
  
  return (
    <>
      {!hideHeader && <Header />}
      <Main>{children}</Main>
      {!hideFooter && <Footer />}
    </>
  );
};