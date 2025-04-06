import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Settlement, SettlementFilter, SettlementStatus } from '../types/settlement.types';

interface SettlementListProps {
  settlements: Settlement[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onLoad: (filter?: SettlementFilter) => Promise<void>;
  onSelectSettlement: (settlement: Settlement) => void;
}

const SettlementList: React.FC<SettlementListProps> = ({
  settlements,
  loading,
  error,
  totalItems,
  totalPages,
  currentPage,
  onLoad,
  onSelectSettlement,
}) => {
  const [filter, setFilter] = useState<SettlementFilter>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    onLoad(filter);
  }, [filter, onLoad]);

  const handlePageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (newFilter: Partial<SettlementFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter, page: 1 }));
  };

  if (loading && settlements.length === 0) {
    return <div>정산 목록을 불러오는 중...</div>;
  }

  if (error && settlements.length === 0) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Header>
        <Title>정산 목록</Title>
        <FilterContainer>
          <FilterSelect
            value={filter.status || ''}
            onChange={(e) => 
              handleFilterChange({ 
                status: e.target.value ? e.target.value as SettlementStatus : undefined 
              })
            }
          >
            <option value="">전체 상태</option>
            <option value={SettlementStatus.SCHEDULED}>예정</option>
            <option value={SettlementStatus.COMPLETED}>완료</option>
            <option value={SettlementStatus.FAILED}>실패</option>
          </FilterSelect>
          <DateRangeContainer>
            <DateInput
              type="date"
              value={filter.startDate || ''}
              onChange={(e) => handleFilterChange({ startDate: e.target.value })}
              placeholder="시작일"
            />
            <DateSeparator>~</DateSeparator>
            <DateInput
              type="date"
              value={filter.endDate || ''}
              onChange={(e) => handleFilterChange({ endDate: e.target.value })}
              placeholder="종료일"
            />
          </DateRangeContainer>
        </FilterContainer>
      </Header>

      {settlements.length === 0 ? (
        <EmptyState>정산 내역이 없습니다.</EmptyState>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>ID</TableHeader>
                <TableHeader>결제 ID</TableHeader>
                <TableHeader>결제 수단</TableHeader>
                <TableHeader>금액</TableHeader>
                <TableHeader>상태</TableHeader>
                <TableHeader>매출일</TableHeader>
                <TableHeader>정산 예정일</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {settlements.map((settlement) => (
                <TableRow 
                  key={settlement.id} 
                  onClick={() => onSelectSettlement(settlement)}
                >
                  <TableCell>{settlement.id}</TableCell>
                  <TableCell>{settlement.paymentId}</TableCell>
                  <TableCell>{settlement.method}</TableCell>
                  <TableCell>{settlement.payOutAmount.toLocaleString()}원</TableCell>
                  <TableCell>
                    <StatusBadge status={settlement.settlementsStatus}>
                      {settlement.settlementsStatus}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{new Date(settlement.soldDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(settlement.paidOutDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination>
            <PaginationInfo>
              총 {totalItems}개 중 {(currentPage - 1) * filter.limit! + 1}-
              {Math.min(currentPage * filter.limit!, totalItems)} 표시
            </PaginationInfo>
            <PaginationControls>
              <PaginationButton 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                이전
              </PaginationButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationButton
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationButton>
              ))}
              <PaginationButton
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                다음
              </PaginationButton>
            </PaginationControls>
          </Pagination>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  min-width: 150px;
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const DateSeparator = styled.span`
  color: #666;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
  cursor: pointer;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: #555;
`;

const TableCell = styled.td`
  padding: 12px 16px;
  color: #333;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
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

const Pagination = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
`;

const PaginationInfo = styled.div`
  color: #666;
  font-size: 14px;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 4px;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${({ active }) => active ? '#1976d2' : '#ddd'};
  background-color: ${({ active }) => active ? '#1976d2' : 'white'};
  color: ${({ active }) => active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background-color: ${({ active }) => active ? '#1565c0' : '#f5f5f5'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: 32px;
  text-align: center;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 16px;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 16px;
`;

export default SettlementList;
