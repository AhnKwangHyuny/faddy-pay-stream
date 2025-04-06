// features/orders/components/OrderCancellation.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../shared/components/ui/Button';

interface OrderCancellationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<boolean>;
  type: 'cancel' | 'refund';
}

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndices.modal};
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.md};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ModalHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 8px;
`;

export const OrderCancellation: React.FC<OrderCancellationProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError(`${type === 'cancel' ? '취소' : '환불'} 사유를 입력해주세요.`);
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await onSubmit(reason);
      if (success) {
        onClose();
      }
    } catch (err) {
      setError(`${type === 'cancel' ? '취소' : '환불'} 처리 중 오류가 발생했습니다.`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {type === 'cancel' ? '주문 취소' : '환불 요청'}
          </ModalTitle>
        </ModalHeader>
        
        <ModalBody>
          <FormGroup>
            <Label htmlFor="cancellation-reason">
              {type === 'cancel' ? '취소 사유' : '환불 사유'}
            </Label>
            <TextArea
              id="cancellation-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`${type === 'cancel' ? '취소' : '환불'} 사유를 입력해주세요.`}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>
        </ModalBody>
        
        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={loading}
          >
            {type === 'cancel' ? '주문 취소' : '환불 요청'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalBackdrop>
  );
};