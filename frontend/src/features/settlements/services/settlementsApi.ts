import { Settlement, SettlementFilter, SettlementSummary } from '../types/settlement.types';

interface SettlementsResponse {
  data: Settlement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 정산 목록을 조회하는 API 함수
 */
export const fetchSettlements = async (
  filter: SettlementFilter = {}
): Promise<SettlementsResponse> => {
  const { status, startDate, endDate, page = 1, limit = 10 } = filter;
  
  // API URL 및 쿼리 파라미터 구성
  const queryParams = new URLSearchParams();
  if (status) queryParams.append('status', status);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  
  const response = await fetch(`/api/payments/settlements?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch settlements');
  }
  
  return response.json();
};

/**
 * 특정 정산 정보를 조회하는 API 함수
 */
export const fetchSettlementById = async (id: number): Promise<Settlement> => {
  const response = await fetch(`/api/payments/settlements/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch settlement with id ${id}`);
  }
  
  return response.json();
};

/**
 * 정산 요약 정보를 조회하는 API 함수
 */
export const fetchSettlementsSummary = async (): Promise<SettlementSummary> => {
  const response = await fetch('/api/payments/settlements/summary');
  
  if (!response.ok) {
    throw new Error('Failed to fetch settlements summary');
  }
  
  return response.json();
};
