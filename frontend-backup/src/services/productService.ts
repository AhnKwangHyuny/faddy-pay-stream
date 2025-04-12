import { Product } from '../types/product.types';
import { apiService } from './api';
import { PaginatedResponse } from '../types/common.types';
import { sampleProducts } from '../data/sampleProducts';

// API 연결 상태를 확인하는 함수
const checkApiConnection = async (): Promise<boolean> => {
  try {
    await apiService.get('/api/health');
    return true;
  } catch (error) {
    console.warn('백엔드 연결 실패, 샘플 데이터를 사용합니다.', error);
    return false;
  }
};

// 모든 상품 조회
export const getProducts = async (): Promise<Product[]> => {
  try {
    // 백엔드 API 호출 시도
    const isConnected = await checkApiConnection();
    
    if (isConnected) {
      return await apiService.get<Product[]>('/api/products');
    } else {
      // 백엔드 연결 실패 시 샘플 데이터 사용
      return sampleProducts;
    }
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    // 오류 발생 시 샘플 데이터로 폴백
    return sampleProducts;
  }
};

// 상품 페이지네이션 조회
export const getProductsPaginated = async (
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<Product>> => {
  try {
    // 백엔드 API 호출 시도
    const isConnected = await checkApiConnection();
    
    if (isConnected) {
      return await apiService.get<PaginatedResponse<Product>>(
        `/api/products?page=${page}&size=${size}`
      );
    } else {
      // 백엔드 연결 실패 시 샘플 데이터로 페이지네이션 구현
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedItems = sampleProducts.slice(startIndex, endIndex);
      
      return {
        content: paginatedItems,
        pageable: {
          pageNumber: page,
          pageSize: size,
        },
        totalElements: sampleProducts.length,
        totalPages: Math.ceil(sampleProducts.length / size),
        last: endIndex >= sampleProducts.length,
        first: page === 0,
      };
    }
  } catch (error) {
    console.error('상품 페이지네이션 조회 실패:', error);
    
    // 오류 발생 시 샘플 데이터로 페이지네이션 구현
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedItems = sampleProducts.slice(startIndex, endIndex);
    
    return {
      content: paginatedItems,
      pageable: {
        pageNumber: page,
        pageSize: size,
      },
      totalElements: sampleProducts.length,
      totalPages: Math.ceil(sampleProducts.length / size),
      last: endIndex >= sampleProducts.length,
      first: page === 0,
    };
  }
};

// 상품 상세 조회
export const getProductById = async (id: string): Promise<Product> => {
  try {
    // 백엔드 API 호출 시도
    const isConnected = await checkApiConnection();
    
    if (isConnected) {
      return await apiService.get<Product>(`/api/products/${id}`);
    } else {
      // 백엔드 연결 실패 시 샘플 데이터에서 ID로 검색
      const product = sampleProducts.find(product => product.id === id);
      
      if (!product) {
        throw new Error('상품을 찾을 수 없습니다.');
      }
      
      return product;
    }
  } catch (error) {
    console.error('상품 상세 조회 실패:', error);
    
    // 오류 발생 시 샘플 데이터에서 ID로 검색
    const product = sampleProducts.find(product => product.id === id);
    
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }
    
    return product;
  }
};

// 상품 검색
export const searchProducts = async (
  keyword: string,
  page: number = 0,
  size: number = 20
): Promise<PaginatedResponse<Product>> => {
  try {
    // 백엔드 API 호출 시도
    const isConnected = await checkApiConnection();
    
    if (isConnected) {
      return await apiService.get<PaginatedResponse<Product>>(
        `/api/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
      );
    } else {
      // 백엔드 연결 실패 시 샘플 데이터에서 검색
      const filteredProducts = sampleProducts.filter(product => 
        product.name.toLowerCase().includes(keyword.toLowerCase()) || 
        (product.description?.toLowerCase().includes(keyword.toLowerCase()) ?? false)
      );
      
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedItems = filteredProducts.slice(startIndex, endIndex);
      
      return {
        content: paginatedItems,
        pageable: {
          pageNumber: page,
          pageSize: size,
        },
        totalElements: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / size),
        last: endIndex >= filteredProducts.length,
        first: page === 0,
      };
    }
  } catch (error) {
    console.error('상품 검색 실패:', error);
    
    // 오류 발생 시 샘플 데이터에서 검색
    const filteredProducts = sampleProducts.filter(product => 
      product.name.toLowerCase().includes(keyword.toLowerCase()) || 
      (product.description?.toLowerCase().includes(keyword.toLowerCase()) ?? false)
    );
    
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedItems = filteredProducts.slice(startIndex, endIndex);
    
    return {
      content: paginatedItems,
      pageable: {
        pageNumber: page,
        pageSize: size,
      },
      totalElements: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / size),
      last: endIndex >= filteredProducts.length,
      first: page === 0,
    };
  }
};
