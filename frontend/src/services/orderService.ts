import { Order } from '../types/order.types';
import { apiService } from './api';

// 주문 생성
export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  return apiService.post<Order>('/api/orders', order);
};

// 주문 조회
export const getOrderById = async (orderId: string): Promise<Order> => {
  return apiService.get<Order>(`/api/orders/${orderId}`);
};

// 주문 내역 조회
export const getOrderHistory = async (): Promise<Order[]> => {
  return apiService.get<Order[]>('/api/orders/history');
};

// 주문 취소
export const cancelOrder = async (orderId: string): Promise<Order> => {
  return apiService.post<Order>(`/api/orders/${orderId}/cancel`);
};

// 주문 품목 취소
export const cancelOrderItems = async (
  orderId: string,
  itemIdxs: number[]
): Promise<Order> => {
  return apiService.post<Order>(`/api/orders/${orderId}/cancel-items`, { itemIdxs });
};
