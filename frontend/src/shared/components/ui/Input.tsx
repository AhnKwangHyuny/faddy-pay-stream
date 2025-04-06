import React, { InputHTMLAttributes, forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, variant = 'outlined', size = 'medium', ...props }, ref) => {
    return (
      <InputContainer fullWidth={fullWidth}>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <StyledInput 
          ref={ref} 
          variant={variant} 
          size={size} 
          hasError={!!error}
          {...props} 
        />
        {error && <ErrorText>{error}</ErrorText>}
      </InputContainer>
    );
  }
);

// 컴포넌트 디스플레이 이름 설정
Input.displayName = 'Input';

const InputContainer = styled.div<{ fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  margin-bottom: 16px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const StyledInput = styled.input<{
  variant: 'outlined' | 'filled' | 'standard';
  size: 'small' | 'medium' | 'large';
  hasError: boolean;
}>`
  padding: ${({ size }) => {
    switch (size) {
      case 'small': return '8px 12px';
      case 'large': return '16px 20px';
      default: return '12px 16px';
    }
  }};
  border-radius: 4px;
  font-size: ${({ size }) => {
    switch (size) {
      case 'small': return '14px';
      case 'large': return '18px';
      default: return '16px';
    }
  }};
  
  ${({ variant }) => {
    switch (variant) {
      case 'outlined':
        return css`
          border: 1px solid #ccc;
          background-color: transparent;
        `;
      case 'filled':
        return css`
          border: none;
          background-color: #f5f5f5;
        `;
      case 'standard':
        return css`
          border: none;
          border-bottom: 1px solid #ccc;
          border-radius: 0;
          background-color: transparent;
        `;
    }
  }}
  
  ${({ hasError }) => hasError && css`
    border-color: #f44336;
    
    &:focus {
      border-color: #f44336;
    }
  `}
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
  
  &::placeholder {
    color: #999;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
`;

export default Input;
