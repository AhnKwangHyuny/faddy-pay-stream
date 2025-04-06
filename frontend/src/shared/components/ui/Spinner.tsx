// shared/components/ui/Spinner.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div<SpinnerProps>`
  display: inline-block;
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '16px';
      case 'medium':
        return '24px';
      case 'large':
        return '32px';
      default:
        return '24px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'small':
        return '16px';
      case 'medium':
        return '24px';
      case 'large':
        return '32px';
      default:
        return '24px';
    }
  }};
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${({ color, theme }) => color || theme.colors.primary};
  animation: ${spin} 0.8s linear infinite;
`;

export const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', color }) => {
  return <SpinnerContainer size={size} color={color} />;
};