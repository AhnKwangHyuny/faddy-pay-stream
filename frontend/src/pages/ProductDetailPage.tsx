import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';

// Skeleton loader component
const ProductDetailSkeleton: React.FC = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
    <div className="bg-gray-200 rounded-lg aspect-square"></div>
    <div className="space-y-6">
      <div className="h-10 bg-gray-200 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded w-1/3"></div>
      <div className="h-14 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id as string),
    enabled: !!id,
  });
  
  if (isLoading) return <ProductDetailSkeleton />;
  
  if (error || !product) {
    return (
      <div className="py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-6">요청하신 상품 정보를 불러오는데 문제가 발생했습니다.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    
    const sizeToUse = product.sizes && product.sizes.length > 0 ? selectedSize : '';
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        quantity,
        size: sizeToUse
      }
    });
    
    // 성공 메시지 표시
    alert('장바구니에 상품이 추가되었습니다.');
  };
  
  const handleBuyNow = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    
    const sizeToUse = product.sizes && product.sizes.length > 0 ? selectedSize : '';
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product,
        quantity,
        size: sizeToUse
      }
    });
    
    navigate('/checkout');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <motion.div 
          className="bg-gray-50 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="aspect-square w-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">이미지 없음</span>
            </div>
          )}
        </motion.div>
        
        {/* Product Info */}
        <motion.div 
          className="flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
          
          <p className="mt-3 text-2xl font-medium text-gray-900">
            {product.price.toLocaleString()}원
          </p>
          
          <div className="mt-6 text-gray-700">
            <p>{product.description}</p>
          </div>
          
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">사이즈</h3>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`
                      px-4 py-2 text-sm font-medium rounded-md border 
                      ${selectedSize === size 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}
                    `}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selection */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900">수량</h3>
            <div className="mt-2 flex items-center">
              <button 
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="mx-4 text-gray-900">{quantity}</span>
              <button 
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart and Buy Now buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <motion.button
              type="button"
              className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-4 text-gray-900 font-medium hover:bg-gray-50"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              장바구니 추가
            </motion.button>
            <motion.button
              type="button"
              className="flex-1 bg-gray-900 rounded-md py-3 px-4 text-white font-medium hover:bg-gray-800"
              onClick={handleBuyNow}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              바로 구매하기
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;