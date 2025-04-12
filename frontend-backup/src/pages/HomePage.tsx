import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types/product.types';

// Skeleton loader component for products grid
const ProductsGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="rounded-lg bg-gray-200 aspect-square w-full"></div>
        <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
);

const HomePage: React.FC = () => {
  const [sortOption, setSortOption] = useState<string>('newest');
  
  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });
  
  // Sort products based on selected option
  const sortedProducts = React.useMemo(() => {
    if (!products) return [];
    
    const productsCopy = [...products];
    
    switch (sortOption) {
      case 'price_asc':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'name_asc':
        return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
      default:
        return productsCopy; // Assuming products are already sorted by newest in the API
    }
  }, [products, sortOption]);
  
  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 inline-block text-left">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                상품 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
        >
          새로고침
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Banner */}
      <motion.div 
        className="relative rounded-lg overflow-hidden bg-gray-900 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
        <div className="relative px-8 py-16 sm:px-12 sm:py-24 lg:py-32">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            새로운 컬렉션 출시
          </h1>
          <p className="mt-4 max-w-lg text-lg text-gray-300">
            2025 시즌 최신 컬렉션을 만나보세요. 새로운 스타일로 당신의 일상에 특별함을 더하세요.
          </p>
          <div className="mt-8">
            <a
              href="#products"
              className="inline-block bg-white border border-transparent rounded-md py-3 px-6 text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              지금 쇼핑하기
            </a>
          </div>
        </div>
      </motion.div>
      
      {/* Products Section */}
      <div id="products">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">모든 상품</h2>
          
          <div className="flex items-center">
            <label htmlFor="sort" className="sr-only">정렬</label>
            <select
              id="sort"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="newest">최신순</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
              <option value="name_asc">이름 오름차순</option>
              <option value="name_desc">이름 내림차순</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <ProductsGridSkeleton />
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Empty state */}
        {!isLoading && sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">상품이 없습니다</h3>
            <p className="mt-1 text-sm text-gray-500">아직 등록된 상품이 없습니다.</p>
          </div>
        )}
      </div>
      
      {/* Features Section */}
      <div className="mt-24">
        <h2 className="sr-only">쇼핑 특징</h2>
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {[
            {
              icon: (
                <svg className="h-8 w-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              ),
              title: '무료 배송',
              description: '50,000원 이상 구매 시 전국 무료 배송 혜택을 제공합니다.',
            },
            {
              icon: (
                <svg className="h-8 w-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: '품질 보증',
              description: '모든 제품은 엄격한 품질 검사를 거쳐 고객에게 제공됩니다.',
            },
            {
              icon: (
                <svg className="h-8 w-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              ),
              title: '안전한 결제',
              description: '토스 페이먼츠의 안전한 결제 시스템으로 편리하게 결제하세요.',
            },
            {
              icon: (
                <svg className="h-8 w-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
              ),
              title: '쉬운 반품',
              description: '상품 수령 후 7일 이내 100% 환불 가능한 반품 정책을 제공합니다.',
            },
          ].map((feature, index) => (
            <motion.div 
              key={index} 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;