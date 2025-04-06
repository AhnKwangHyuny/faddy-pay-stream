// features/checkout/services/checkoutApi.ts
import { apiClient } from '../../../services/api/client';
import { handleApiError } from '../../../services/api/errorHandler';
import { ApiResponse } from '../../../shared/types/common.types';
import { Cart } from '../../cart/types/cart.types';
import { Order } from '../../orders/types/order.types';
import { Address, PaymentRequest } from '../types/checkout.types';

// 주문 생성 API
export const createOrder = async (
  cart: Cart,
  shippingAddress: Address
): Promise<{ orderId: string; orderName: string; amount: number }> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ orderId: string; orderName: string; amount: number }>
    >('/orders', {
      items: cart.items,
      shippingAddress,
    });
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 결제 요청 생성 API
export const createPaymentRequest = async (
  orderId: string,
  amount: number,
  customerName: string
): Promise<PaymentRequest> => {
  try {
    const response = await apiClient.post<ApiResponse<PaymentRequest>>(
      '/payments/request',
      {
        orderId,
        amount,
        customerName,
      }
    );
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// 결제 완료 확인 API
export const verifyPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<Order> => {
  try {
    const response = await apiClient.post<ApiResponse<Order>>(
      '/payments/verify',
      {
        paymentKey,
        orderId,
        amount,
      }
    );
    
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};