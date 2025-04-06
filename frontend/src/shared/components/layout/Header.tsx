// shared/components/layout/Header.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import { Navbar } from './Navbar';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: white;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: ${({ theme }) => theme.zIndices.header};
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textDark};
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textDark};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryLight};
  }
`;

const MobileMenuButton = styled(IconButton)`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const Header: React.FC = () => {
  const { isMobile } = useResponsive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <HeaderContainer>
      <LogoContainer to="/">
        <Logo>FADDY</Logo>
      </LogoContainer>
      
      <Navbar isMobile={isMobile} isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <RightSection>
        <IconButton as={Link} to="/cart" aria-label="장바구니">
          🛒
        </IconButton>
        
        <MobileMenuButton onClick={toggleMobileMenu} aria-label="메뉴 열기/닫기">
          {mobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </RightSection>
    </HeaderContainer>
  );
};