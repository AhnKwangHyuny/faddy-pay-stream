// features/cart/services/cartApi.ts
import { apiClient } from '../../../services/api/client';
import { handleApiError } from '../../../services/api/errorHandler';
import { Cart } from '../types/cart.types';
import { ApiResponse } from '../../../shared/types/common.types';

// 장바구니 조회 API
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 장바구니 저장 API
export const saveCart = async (cart: Cart): Promise<Cart> => {
  try {
    const response = await apiClient.post<ApiResponse<Cart>>('/cart', cart);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 장바구니 비우기 API
export const clearCart = async (): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<void>>('/cart');
  } catch (error) {
    throw handleApiError(error);
  }
};