// features/products/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFilter } from '../types/product.types';
import { getProducts } from '../services/productsApi';
import { PaginatedResponse } from '../../../shared/types/common.types';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  totalItems: number;
  refetch: () => Promise<void>;
}

export const useProducts = (
  page = 1,
  limit = 12,
  filter?: ProductFilter
): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProducts(page, limit, filter);
      
      // 첫 페이지면 상품 목록 초기화, 아니면 기존 목록에 추가
      if (page === 1) {
        setProducts(response.items);
      } else {
        setProducts((prev) => [...prev, ...response.items]);
      }
      
      setTotalItems(response.total);
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filter]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  return {
    products,
    loading,
    error,
    hasMore,
    totalItems,
    refetch: fetchProducts,
  };
};