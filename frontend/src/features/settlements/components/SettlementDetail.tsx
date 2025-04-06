import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Settlement } from '../types/settlement.types';

interface SettlementDetailProps {
  settlementId: number;
  settlement: Settlement | null;
  loading: boolean;
  error: string | null;
  onLoad: (id: number) => Promise<void>;
}

const SettlementDetail: React.FC<SettlementDetailProps> = ({
  settlementId,
  settlement,
  loading,
  error,
  onLoad,
}) => {
  useEffect(() => {
    onLoad(settlementId);
  }, [settlementId, onLoad]);

  if (loading) {
    return <div>정산 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!settlement) {
    return <div>정산 정보가 없습니다.</div>;
  }

  return (
    <Container>
      <Title>정산 상세 정보</Title>
      
      <DetailSection>
        <SectionTitle>기본 정보</SectionTitle>
        <DetailRow>
          <DetailLabel>정산 ID</DetailLabel>
          <DetailValue>{settlement.id}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>결제 ID</DetailLabel>
          <DetailValue>{settlement.paymentId}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>결제 수단</DetailLabel>
          <DetailValue>{settlement.method}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>상태</DetailLabel>
          <DetailValue>
            <StatusBadge status={settlement.settlementsStatus}>
              {settlement.settlementsStatus}
            </StatusBadge>
          </DetailValue>
        </DetailRow>
      </DetailSection>
      
      <DetailSection>
        <SectionTitle>금액 정보</SectionTitle>
        <DetailRow>
          <DetailLabel>총 결제 금액</DetailLabel>
          <DetailValue>{settlement.totalAmount.toLocaleString()}원</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>정산 금액</DetailLabel>
          <DetailValue>{settlement.payOutAmount.toLocaleString()}원</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>취소 금액</DetailLabel>
          <DetailValue>{settlement.canceledAmount.toLocaleString()}원</DetailValue>
        </DetailRow>
      </DetailSection>
      
      <DetailSection>
        <SectionTitle>일정 정보</SectionTitle>
        <DetailRow>
          <DetailLabel>매출일</DetailLabel>
          <DetailValue>{new Date(settlement.soldDate).toLocaleDateString()}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>정산 예정일</DetailLabel>
          <DetailValue>{new Date(settlement.paidOutDate).toLocaleDateString()}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>등록일</DetailLabel>
          <DetailValue>{new Date(settlement.regDt).toLocaleString()}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>수정일</DetailLabel>
          <DetailValue>{new Date(settlement.updDt).toLocaleString()}</DetailValue>
        </DetailRow>
      </DetailSection>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
`;

const DetailSection = styled.section`
  margin-bottom: 28px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  width: 30%;
  color: #666;
  font-weight: 500;
`;

const DetailValue = styled.div`
  width: 70%;
  color: #333;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  
  ${({ status }) => {
    switch (status) {
      case 'SCHEDULED':
        return `
          background-color: #e3f2fd;
          color: #1976d2;
        `;
      case 'COMPLETED':
        return `
          background-color: #e8f5e9;
          color: #388e3c;
        `;
      case 'FAILED':
        return `
          background-color: #ffebee;
          color: #d32f2f;
        `;
      default:
        return `
          background-color: #f5f5f5;
          color: #616161;
        `;
    }
  }}
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 16px;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 16px;
`;

export default SettlementDetail;
