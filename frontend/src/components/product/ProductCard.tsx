import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div 
      className="group relative flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link to={`/products/${product.id}`} className="block overflow-hidden rounded-lg">
        {product.imageUrl ? (
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">이미지 없음</span>
          </div>
        )}
      </Link>
      
      <div className="mt-4 flex flex-col">
        <h3 className="text-sm font-medium text-gray-900">
          <Link to={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        
        <p className="mt-1 text-sm text-gray-600">
          {product.description && product.description.length > 80 
            ? product.description.substring(0, 80) + '...' 
            : product.description}
        </p>
        
        <p className="mt-2 text-lg font-medium text-gray-900">
          {product.price.toLocaleString()}원
        </p>
        
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {product.sizes.join(', ')}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;