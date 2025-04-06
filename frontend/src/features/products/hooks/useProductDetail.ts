// features/products/hooks/useProductDetail.ts
import { useState, useEffect } from 'react';
import { Product } from '../types/product.types';
import { getProductById } from '../services/productsApi';

interface UseProductDetailReturn {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useProductDetail = (productId: string): UseProductDetailReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProduct();
  }, [productId]);
  
  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
};