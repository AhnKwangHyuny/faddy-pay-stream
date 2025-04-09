import { Product } from '../types/product.types';
import { apiService } from './api';
import { PaginatedResponse } from '../types/common.types';
import { sampleProducts } from '../data/sampleProducts';

// 모든 상품 조회
export const getProducts = async (): Promise<Product[]> => {
  // 백엔드 연결 전에는 샘플 데이터 사용
  // return apiService.get<Product[]>('/api/products');
  return Promise.resolve(sampleProducts);
};

// 상품 페이지네이션 조회
export const getProductsPaginated = async (
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<Product>> => {
  // 백엔드 연결 전에는 샘플 데이터로 페이지네이션 구현
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedItems = sampleProducts.slice(startIndex, endIndex);
  
  return Promise.resolve({
    content: paginatedItems,
    pageable: {
      pageNumber: page,
      pageSize: size,
    },
    totalElements: sampleProducts.length,
    totalPages: Math.ceil(sampleProducts.length / size),
    last: endIndex >= sampleProducts.length,
    first: page === 0,
  });
};

// 상품 상세 조회
export const getProductById = async (id: string): Promise<Product> => {
  // 백엔드 연결 전에는 샘플 데이터에서 ID로 검색
  // return apiService.get<Product>(`/api/products/${id}`);
  const product = sampleProducts.find(product => product.id === id);
  
  if (!product) {
    return Promise.reject(new Error('상품을 찾을 수 없습니다.'));
  }
  
  return Promise.resolve(product);
};

// 상품 검색
export const searchProducts = async (
  keyword: string,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<Product>> => {
  // 백엔드 연결 전에는 샘플 데이터에서 검색
  const filteredProducts = sampleProducts.filter(product => 
    product.name.toLowerCase().includes(keyword.toLowerCase()) || 
    (product.description?.toLowerCase().includes(keyword.toLowerCase()) ?? false)
  );
  
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedItems = filteredProducts.slice(startIndex, endIndex);
  
  return Promise.resolve({
    content: paginatedItems,
    pageable: {
      pageNumber: page,
      pageSize: size,
    },
    totalElements: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / size),
    last: endIndex >= filteredProducts.length,
    first: page === 0,
  });
};
