// features/cart/components/CartButton.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

interface CartButtonProps {
  size?: 'small' | 'medium' | 'large';
}

const CartButtonContainer = styled(Link)<{ size: string }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 50%;
  transition: background-color 0.2s;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '40px';
      case 'medium':
        return '48px';
      case 'large':
        return '56px';
      default:
        return '48px';
    }
  }};
  
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '40px';
      case 'medium':
        return '48px';
      case 'large':
        return '56px';
      default:
        return '48px';
    }
  }};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const CartIcon = styled.div`
  font-size: 20px;
`;

const CartBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: 12px;
  font-weight: 600;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CartButton: React.FC<CartButtonProps> = ({ size = 'medium' }) => {
  const { cart } = useCart();
  const totalItems = cart.totalItems;

  return (
    <CartButtonContainer to="/cart" size={size}>
      <CartIcon>🛒</CartIcon>
      {totalItems > 0 && <CartBadge>{totalItems > 99 ? '99+' : totalItems}</CartBadge>}
    </CartButtonContainer>
  );
};