// features/orders/hooks/useOrderDetail.ts
import { useState, useEffect } from 'react';
import { Order } from '../types/order.types';
import { getOrderById, cancelOrder, requestRefund } from '../services/ordersApi';
import { toast } from 'react-toastify';

interface UseOrderDetailReturn {
  order: Order | null;
  loading: boolean;
  error: Error | null;
  cancelOrderRequest: (reason: string) => Promise<boolean>;
  requestRefundRequest: (
    reason: string,
    items?: { productId: string; quantity: number }[]
  ) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useOrderDetail = (orderId: string): UseOrderDetailReturn => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchOrder = async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrder();
  }, [orderId]);
  
  // 주문 취소 요청
  const cancelOrderRequest = async (reason: string): Promise<boolean> => {
    if (!orderId) return false;
    
    try {
      setLoading(true);
      
      const updatedOrder = await cancelOrder(orderId, reason);
      setOrder(updatedOrder);
      
      toast.success('주문이 성공적으로 취소되었습니다.');
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(`주문 취소 실패: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // 환불 요청
  const requestRefundRequest = async (
    reason: string,
    items?: { productId: string; quantity: number }[]
  ): Promise<boolean> => {
    if (!orderId) return false;
    
    try {
      setLoading(true);
      
      const updatedOrder = await requestRefund(orderId, reason, items);
      setOrder(updatedOrder);
      
      toast.success('환불이 요청되었습니다.');
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(`환불 요청 실패: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    order,
    loading,
    error,
    cancelOrderRequest,
    requestRefundRequest,
    refetch: fetchOrder
  };
};