// 10. 공유 UI 컴포넌트 - 버튼
// shared/components/ui/Button.tsx
import React, { ElementType, ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

// 다형성 컴포넌트를 위한 타입 정의
type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends ElementType,
  Props = {}
> = PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export type ButtonProps<C extends ElementType = 'button'> = PolymorphicComponentProp<C, ButtonOwnProps>;

type StyledButtonProps = {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  $isLoading: boolean;
};

const StyledButtonBase = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none; // Link 컴포넌트와 함께 사용할 때 필요

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 6px 12px;
          font-size: 14px;
        `;
      case 'medium':
        return css`
          padding: 8px 16px;
          font-size: 16px;
        `;
      case 'large':
        return css`
          padding: 12px 24px;
          font-size: 18px;
        `;
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          border: 1px solid ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
            border-color: ${theme.colors.primaryDark};
          }
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: white;
          border: 1px solid ${theme.colors.secondary};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondaryDark};
            border-color: ${theme.colors.secondaryDark};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryLight};
            color: ${theme.colors.primary};
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: none;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryLight};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const IconWrapper = styled.span<{ position: 'start' | 'end' }>`
  display: flex;
  align-items: center;
  margin-left: ${({ position }) => (position === 'end' ? '8px' : '0')};
  margin-right: ${({ position }) => (position === 'start' ? '8px' : '0')};
`;

// 다형성 컴포넌트를 위한 Button 함수
export const Button = <C extends ElementType = 'button'>({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  startIcon,
  endIcon,
  disabled,
  as,
  ...props
}: ButtonProps<C>) => {
  const Component = as || 'button';
  
  return (
    <StyledButtonBase
      as={Component}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && startIcon && <IconWrapper position="start">{startIcon}</IconWrapper>}
      {children}
      {!isLoading && endIcon && <IconWrapper position="end">{endIcon}</IconWrapper>}
    </StyledButtonBase>
  );
};