// features/orders/services/ordersApi.ts
import { apiClient } from '../../../services/api/client';
import { handleApiError } from '../../../services/api/errorHandler';
import { Order } from '../types/order.types';
import { ApiResponse, PaginatedResponse } from '../../../shared/types/common.types';

// 주문 목록 조회 API
export const getOrders = async (
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Order>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
      '/orders',
      { params: { page, limit } }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 주문 상세 조회 API
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 주문 취소 요청 API
export const cancelOrder = async (
  orderId: string, 
  reason: string
): Promise<Order> => {
  try {
    const response = await apiClient.post<ApiResponse<Order>>(
      `/orders/${orderId}/cancel`,
      { reason }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 환불 요청 API
export const requestRefund = async (
  orderId: string,
  reason: string,
  items?: { productId: string; quantity: number }[]
): Promise<Order> => {
  try {
    const response = await apiClient.post<ApiResponse<Order>>(
      `/orders/${orderId}/refund`,
      { reason, items }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};