import { useState, useEffect, useCallback } from 'react';
import { 
  fetchSettlements, 
  fetchSettlementById, 
  fetchSettlementsSummary 
} from '../services/settlementsApi';
import { 
  Settlement, 
  SettlementFilter, 
  SettlementSummary 
} from '../types/settlement.types';

interface UseSettlementsResult {
  settlements: Settlement[];
  settlement: Settlement | null;
  summary: SettlementSummary | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  getSettlements: (filter?: SettlementFilter) => Promise<void>;
  getSettlement: (id: number) => Promise<void>;
  getSummary: () => Promise<void>;
}

export const useSettlements = (): UseSettlementsResult => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const getSettlements = useCallback(async (filter: SettlementFilter = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchSettlements(filter);
      setSettlements(response.data);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : '정산 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSettlement = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchSettlementById(id);
      setSettlement(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '정산 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchSettlementsSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '정산 요약 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    settlements,
    settlement,
    summary,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    getSettlements,
    getSettlement,
    getSummary,
  };
};

export default useSettlements;
