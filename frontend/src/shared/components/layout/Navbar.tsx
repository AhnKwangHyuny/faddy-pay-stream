// shared/components/layout/Navbar.tsx
import React from 'react';
import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const NavContainer = styled.nav<{ isMobile: boolean; isOpen: boolean }>`
  display: flex;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    padding: 20px;
    background-color: white;
    transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
    transition: transform 0.3s ease;
    z-index: ${({ theme }) => theme.zIndices.modal};
    overflow-y: auto;
  }
`;

const NavLink = styled(RouterNavLink)`
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.textDark};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 16px 0;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`;

export const Navbar: React.FC<NavbarProps> = ({ isMobile, isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {isMobile && isOpen && <Backdrop onClick={onClose} />}
      <NavContainer isMobile={isMobile} isOpen={isOpen}>
        <NavLink to="/products" onClick={isMobile ? onClose : undefined}>
          상품
        </NavLink>
        <NavLink to="/orders" onClick={isMobile ? onClose : undefined}>
          주문 내역
        </NavLink>
        {!isAuthenticated && (
          <NavLink to="/login" onClick={isMobile ? onClose : undefined}>
            로그인
          </NavLink>
        )}
      </NavContainer>
    </>
  );
};