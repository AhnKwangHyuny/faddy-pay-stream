// 17. 결제 컴포넌트
// features/checkout/components/PaymentMethodSelector.tsx
import React from 'react';
import styled from 'styled-components';
import { PaymentMethod } from '../../../shared/types/common.types';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  availableMethods?: PaymentMethod[];
}

const Container = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: 16px;
`;

const MethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MethodItem = styled.label<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primaryLight : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RadioInput = styled.input`
  margin-right: 12px;
  cursor: pointer;
`;

const MethodInfo = styled.div`
  flex: 1;
`;

const MethodName = styled.div`
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const MethodDescription = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 4px;
`;

const MethodIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 결제 수단별 아이콘과 설명
const paymentMethodsInfo: Record<PaymentMethod, { name: string; description: string; icon: string }> = {
  CARD: {
    name: '신용/체크카드',
    description: '모든 국내외 카드 결제 가능',
    icon: '💳'
  },
  VIRTUAL_ACCOUNT: {
    name: '가상계좌',
    description: '은행별 가상계좌 발급 (준비중)',
    icon: '🏦'
  },
  PHONE: {
    name: '휴대폰 결제',
    description: '통신사 휴대폰 결제 (준비중)',
    icon: '📱'
  },
  TRANSFER: {
    name: '계좌이체',
    description: '실시간 계좌이체 (준비중)',
    icon: '💸'
  }
};

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  availableMethods = ['CARD'] // 현재는 카드만 지원
}) => {
  return (
    <Container>
      <Title>결제 수단</Title>
      <MethodList>
        {availableMethods.map((method) => (
          <MethodItem
            key={method}
            isSelected={selectedMethod === method}
            htmlFor={`payment-method-${method}`}
          >
            <RadioInput
              type="radio"
              id={`payment-method-${method}`}
              name="paymentMethod"
              value={method}
              checked={selectedMethod === method}
              onChange={() => onMethodChange(method)}
            />
            <MethodInfo>
              <MethodName>{paymentMethodsInfo[method].name}</MethodName>
              <MethodDescription>{paymentMethodsInfo[method].description}</MethodDescription>
            </MethodInfo>
            <MethodIcon>{paymentMethodsInfo[method].icon}</MethodIcon>
          </MethodItem>
        ))}
      </MethodList>
    </Container>
  );
};