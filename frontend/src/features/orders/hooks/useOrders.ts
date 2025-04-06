// features/orders/hooks/useOrders.ts
import { useState, useEffect, useCallback } from 'react';
import { Order } from '../types/order.types';
import { getOrders } from '../services/ordersApi';
import { PaginatedResponse } from '../../../shared/types/common.types';

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  totalItems: number;
  page: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export const useOrders = (
  initialPage = 1,
  limit = 10
): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(initialPage);
  
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getOrders(page, limit);
      
      // 첫 페이지면 주문 목록 초기화, 아니면 기존 목록에 추가
      if (page === 1) {
        setOrders(response.items);
      } else {
        setOrders((prev) => [...prev, ...response.items]);
      }
      
      setTotalItems(response.total);
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);
  
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  return {
    orders,
    loading,
    error,
    hasMore,
    totalItems,
    page,
    setPage,
    refetch: fetchOrders,
  };
};