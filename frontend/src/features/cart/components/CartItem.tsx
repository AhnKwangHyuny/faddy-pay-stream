// features/cart/components/CartItem.tsx
import React from 'react';
import styled from 'styled-components';
import { CartItem as CartItemType } from '../types/cart.types';
import { formatPrice } from '../../../shared/utils/formatters';
import { Button } from '../../../shared/components/ui/Button';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

const ItemContainer = styled.div`
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 120px;
  object-fit: cover;
  margin-right: 16px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 80px;
    height: 96px;
    margin-bottom: 8px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: 4px;
`;

const ItemSize = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 4px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const RegularPrice = styled.span<{ hasDiscount: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ hasDiscount, theme }) => (hasDiscount ? theme.colors.textLight : theme.colors.text)};
  text-decoration: ${({ hasDiscount }) => (hasDiscount ? 'line-through' : 'none')};
  margin-right: ${({ hasDiscount }) => (hasDiscount ? '8px' : '0')};
`;

const DiscountPrice = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.danger};
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-right: 0;
  }
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: white;
  font-size: ${({ theme }) => theme.fontSizes.md};
  
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
  width: 40px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: none;
  border-right: none;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const RemoveButton = styled(Button)`
  margin-left: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    margin-left: 0;
  }
`;

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  const hasDiscount = !!item.discountPrice && item.discountPrice < item.price;
  
  const handleQuantityChange = (value: number) => {
    onQuantityChange(Math.max(1, value));
  };
  
  return (
    <ItemContainer>
      <ItemImage src={item.imageUrl} alt={item.productName} />
      
      <ItemDetails>
        <ItemInfo>
          <ItemName>{item.productName}</ItemName>
          <ItemSize>사이즈: {item.size}</ItemSize>
          <PriceContainer>
            <RegularPrice hasDiscount={hasDiscount}>
              {formatPrice(item.price)}
            </RegularPrice>
            {hasDiscount && (
              <DiscountPrice>{formatPrice(item.discountPrice!)}</DiscountPrice>
            )}
          </PriceContainer>
        </ItemInfo>
        
        <ActionsContainer>
          <QuantityControl>
            <QuantityButton
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </QuantityButton>
            <QuantityInput
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            />
            <QuantityButton
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </QuantityButton>
          </QuantityControl>
          
          <RemoveButton
            size="small"
            variant="text"
            onClick={onRemove}
          >
            삭제
          </RemoveButton>
        </ActionsContainer>
      </ItemDetails>
    </ItemContainer>
  );
};