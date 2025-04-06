// features/products/components/ProductDetails.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Product, Size } from '../types/product.types';
import { formatPrice } from '../../../shared/utils/formatters';
import { Button } from '../../../shared/components/ui/Button';
import { useCart } from '../../cart/hooks/useCart';
import { CartItem } from '../../cart/types/cart.types';
import { toast } from 'react-toastify';

interface ProductDetailsProps {
  product: Product;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
  }
`;

const ImagesContainer = styled.div`
  flex: 1;
  max-width: 500px;
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 16px;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
`;

const Thumbnail = styled.img<{ isActive: boolean }>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  border: 2px solid ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : 'transparent'};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  margin-bottom: 8px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const RegularPrice = styled.span<{ hasDiscount: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ hasDiscount, theme }) => (hasDiscount ? theme.colors.textLight : theme.colors.text)};
  text-decoration: ${({ hasDiscount }) => (hasDiscount ? 'line-through' : 'none')};
  margin-right: ${({ hasDiscount }) => (hasDiscount ? '12px' : '0')};
`;

const DiscountPrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.danger};
`;

const DiscountBadge = styled.span`
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 600;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  margin-left: 8px;
`;

const Description = styled.p`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.6;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 16px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
`;

const SizeSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SizeButton = styled.button<{ isSelected: boolean; isAvailable: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${({ isSelected, isAvailable, theme }) => 
    !isAvailable ? theme.colors.borderDark :
    isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background-color: ${({ isSelected, isAvailable, theme }) => 
    !isAvailable ? theme.colors.secondaryLight :
    isSelected ? theme.colors.primaryLight : 'white'};
  color: ${({ isAvailable, theme }) => 
    isAvailable ? theme.colors.textDark : theme.colors.textLight};
  font-weight: ${({ isSelected }) => (isSelected ? '600' : '400')};
  cursor: ${({ isAvailable }) => (isAvailable ? 'pointer' : 'not-allowed')};
  
  &:hover {
    border-color: ${({ isAvailable, theme }) => 
      isAvailable ? theme.colors.primary : theme.colors.borderDark};
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  max-width: 150px;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: white;
  font-size: ${({ theme }) => theme.fontSizes.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.secondaryLight};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: none;
  border-right: none;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.md};
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const StockInfo = styled.div<{ inStock: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ inStock, theme }) => 
    inStock ? theme.colors.success : theme.colors.danger};
  margin-top: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) 
    : 0;
  
  // 재고가 있는지 확인
  const isSizeAvailable = (size: Size): boolean => {
    return product.stock[size] > 0;
  };
  
  // 선택한 사이즈의 재고 확인
  const getSelectedSizeStock = (): number => {
    return selectedSize ? product.stock[selectedSize] : 0;
  };
  
  const handleSizeSelect = (size: Size) => {
    if (isSizeAvailable(size)) {
      setSelectedSize(size);
      
      // 재고보다 많은 수량이 선택되어 있으면 최대 재고로 조정
      if (quantity > product.stock[size]) {
        setQuantity(product.stock[size]);
      }
    }
  };
  
  const handleQuantityChange = (value: number) => {
    const stock = getSelectedSizeStock();
    const newQuantity = Math.max(1, Math.min(value, stock));
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('사이즈를 선택해주세요.');
      return;
    }
    
    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      size: selectedSize,
      quantity,
      imageUrl: product.images[0],
    };
    
    addToCart(cartItem);
    toast.success('장바구니에 상품이 추가되었습니다.');
  };
  
  return (
    <Container>
      <ImagesContainer>
        <MainImage src={selectedImage} alt={product.name} />
        
        <ThumbnailsContainer>
          {product.images.map((image, index) => (
            <Thumbnail
              key={index}
              src={image}
              alt={`${product.name} ${index + 1}`}
              isActive={image === selectedImage}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </ThumbnailsContainer>
      </ImagesContainer>
      
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        
        <PriceContainer>
          <RegularPrice hasDiscount={hasDiscount}>
            {formatPrice(product.price)}
          </RegularPrice>
          
          {hasDiscount && (
            <>
              <DiscountPrice>{formatPrice(product.discountPrice!)}</DiscountPrice>
              <DiscountBadge>{discountPercentage}% OFF</DiscountBadge>
            </>
          )}
        </PriceContainer>
        
        <Description>{product.description}</Description>
        
        <Divider />
        
        <FormGroup>
          <Label>사이즈</Label>
          <SizeSelector>
            {product.availableSizes.map((size) => (
              <SizeButton
                key={size}
                isSelected={selectedSize === size}
                isAvailable={isSizeAvailable(size)}
                onClick={() => handleSizeSelect(size)}
                disabled={!isSizeAvailable(size)}
              >
                {size}
              </SizeButton>
            ))}
          </SizeSelector>
          
          {selectedSize && (
            <StockInfo inStock={getSelectedSizeStock() > 0}>
              {getSelectedSizeStock() > 0
                ? `재고: ${getSelectedSizeStock()}개`
                : '품절'}
            </StockInfo>
          )}
        </FormGroup>
        
        {selectedSize && (
          <FormGroup>
            <Label>수량</Label>
            <QuantitySelector>
              <QuantityButton
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </QuantityButton>
              <QuantityInput
                type="number"
                min="1"
                max={getSelectedSizeStock()}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              />
              <QuantityButton
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= getSelectedSizeStock()}
              >
                +
              </QuantityButton>
            </QuantitySelector>
          </FormGroup>
        )}
        
        <ButtonGroup>
          <Button
            variant="primary"
            fullWidth
            onClick={handleAddToCart}
            disabled={!selectedSize || getSelectedSizeStock() === 0}
          >
            장바구니에 담기
          </Button>
        </ButtonGroup>
      </ProductInfo>
    </Container>
  );
};