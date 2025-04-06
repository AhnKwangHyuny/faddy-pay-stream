// 15. 상품 카드 컴포넌트
// features/products/components/ProductCard.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Product } from '../types/product.types';
import { formatPrice } from '../../../shared/utils/formatters';

interface ProductCardProps {
  product: Product;
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: ${({ theme }) => theme.colors.white};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 125%; // 4:5 비율
  overflow: hidden;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-weight: 600;
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const ContentContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
`;

const RegularPrice = styled.span<{ hasDiscount: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  color: ${({ hasDiscount, theme }) => (hasDiscount ? theme.colors.textLight : theme.colors.text)};
  text-decoration: ${({ hasDiscount }) => (hasDiscount ? 'line-through' : 'none')};
  margin-right: ${({ hasDiscount }) => (hasDiscount ? '8px' : '0')};
`;

const DiscountPrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.danger};
`;

const SizeChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 10px;
`;

const SizeChip = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ theme }) => theme.colors.secondaryLight};
  color: ${({ theme }) => theme.colors.textDark};
`;

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) 
    : 0;
  
  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <Card>
        <ImageContainer>
          <ProductImage src={product.images[0]} alt={product.name} />
          {hasDiscount && <DiscountBadge>{discountPercentage}% OFF</DiscountBadge>}
        </ImageContainer>
        <ContentContainer>
          <ProductName>{product.name}</ProductName>
          <PriceContainer>
            <RegularPrice hasDiscount={hasDiscount}>
              {formatPrice(product.price)}
            </RegularPrice>
            {hasDiscount && (
              <DiscountPrice>{formatPrice(product.discountPrice!)}</DiscountPrice>
            )}
          </PriceContainer>
          <SizeChips>
            {product.availableSizes.map((size) => (
              <SizeChip key={size}>{size}</SizeChip>
            ))}
          </SizeChips>
        </ContentContainer>
      </Card>
    </Link>
  );
};