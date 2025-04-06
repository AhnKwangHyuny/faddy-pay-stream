import React, { SelectHTMLAttributes, forwardRef } from 'react';
import styled, { css } from 'styled-components';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: Option[];
  error?: string;
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth = false, variant = 'outlined', size = 'medium', ...props }, ref) => {
    return (
      <SelectContainer fullWidth={fullWidth}>
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <SelectWrapper variant={variant} size={size} hasError={!!error}>
          <StyledSelect 
            ref={ref} 
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </StyledSelect>
          <ArrowIcon />
        </SelectWrapper>
        {error && <ErrorText>{error}</ErrorText>}
      </SelectContainer>
    );
  }
);

// 컴포넌트 디스플레이 이름 설정
Select.displayName = 'Select';

const SelectContainer = styled.div<{ fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  margin-bottom: 16px;
  position: relative;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const SelectWrapper = styled.div<{
  variant: 'outlined' | 'filled' | 'standard';
  size: 'small' | 'medium' | 'large';
  hasError: boolean;
}>`
  position: relative;
  width: 100%;
  
  ${({ variant, hasError }) => {
    switch (variant) {
      case 'outlined':
        return css`
          border: 1px solid ${hasError ? '#f44336' : '#ccc'};
          border-radius: 4px;
          background-color: transparent;
        `;
      case 'filled':
        return css`
          border: none;
          border-bottom: 1px solid ${hasError ? '#f44336' : '#ccc'};
          background-color: #f5f5f5;
          border-radius: 4px 4px 0 0;
        `;
      case 'standard':
        return css`
          border: none;
          border-bottom: 1px solid ${hasError ? '#f44336' : '#ccc'};
          border-radius: 0;
          background-color: transparent;
        `;
    }
  }}
  
  &:focus-within {
    border-color: #2196f3;
  }
`;

const StyledSelect = styled.select<{ size?: 'small' | 'medium' | 'large' }>`
  width: 100%;
  padding: ${({ size }) => {
    switch (size) {
      case 'small': return '8px 12px';
      case 'large': return '16px 20px';
      default: return '12px 16px';
    }
  }};
  font-size: ${({ size }) => {
    switch (size) {
      case 'small': return '14px';
      case 'large': return '18px';
      default: return '16px';
    }
  }};
  border: none;
  background-color: transparent;
  appearance: none;
  outline: none;
  cursor: pointer;
  
  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
`;

const ArrowIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  
  &:after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-right: 2px solid #666;
    border-bottom: 2px solid #666;
    transform: rotate(45deg);
  }
`;

const ErrorText = styled.span`
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
`;

export default Select;
