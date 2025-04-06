// features/orders/components/OrderStatus.tsx
import React from 'react';
import styled from 'styled-components';
import { OrderStatus as OrderStatusType } from '../../../shared/types/common.types';

interface OrderStatusProps {
  status: OrderStatusType;
  size?: 'small' | 'medium' | 'large';
}

interface StatusConfig {
  label: string;
  color: string;
  backgroundColor: string;
}

const statusConfig: Record<OrderStatusType, StatusConfig> = {
  CREATED: {
    label: '주문 생성',
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
  },
  PENDING_PAYMENT: {
    label: '결제 대기',
    color: '#fd7e14',
    backgroundColor: '#fff3e0',
  },
  PAID: {
    label: '결제 완료',
    color: '#28a745',
    backgroundColor: '#e8f5e9',
  },
  DELIVERING: {
    label: '배송 중',
    color: '#007bff',
    backgroundColor: '#e3f2fd',
  },
  DELIVERED: {
    label: '배송 완료',
    color: '#6f42c1',
    backgroundColor: '#f3e8fd',
  },
  COMPLETED: {
    label: '주문 완료',
    color: '#4caf50',
    backgroundColor: '#e8f5e9',
  },
  CANCELED: {
    label: '주문 취소',
    color: '#dc3545',
    backgroundColor: '#feebef',
  },
  REFUND_REQUESTED: {
    label: '환불 요청',
    color: '#fd7e14',
    backgroundColor: '#fff3e0',
  },
  REFUNDED: {
    label: '환불 완료',
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
  },
};

const StatusBadge = styled.div<{
  color: string;
  backgroundColor: string;
  size: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 999px;
  font-weight: 600;
  white-space: nowrap;
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          font-size: 12px;
          padding: 4px 8px;
        `;
      case 'medium':
        return `
          font-size: 14px;
          padding: 6px 12px;
        `;
      case 'large':
        return `
          font-size: 16px;
          padding: 8px 16px;
        `;
      default:
        return `
          font-size: 14px;
          padding: 6px 12px;
        `;
    }
  }}
`;

export const OrderStatus: React.FC<OrderStatusProps> = ({
  status,
  size = 'medium',
}) => {
  const config = statusConfig[status] || statusConfig.CREATED;
  
  return (
    <StatusBadge
      color={config.color}
      backgroundColor={config.backgroundColor}
      size={size}
    >
      {config.label}
    </StatusBadge>
  );
};