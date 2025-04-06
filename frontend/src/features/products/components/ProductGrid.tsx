// features/products/components/ProductGrid.tsx
import React from 'react';
import styled from 'styled-components';
import { Product } from '../types/product.types';
import { ProductCard } from './ProductCard';
import { useResponsive } from '../../../shared/hooks/useResponsive';

interface ProductGridProps {
  products: Product[];
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
`;

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <Grid>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  );
};