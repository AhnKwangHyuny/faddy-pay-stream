// 9. 상품 API 서비스
// features/products/services/productsApi.ts
import { apiClient } from '../../../services/api/client';
import { handleApiError } from '../../../services/api/errorHandler';
import { Product, ProductFilter } from '../types/product.types';
import { ApiResponse, PaginatedResponse } from '../../../shared/types/common.types';

export const getProducts = async (
  page = 1, 
  limit = 12, 
  filter?: ProductFilter
): Promise<PaginatedResponse<Product>> => {
  try {
    const params = { page, limit, ...filter };
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};