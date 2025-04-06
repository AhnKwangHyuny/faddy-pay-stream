// features/cart/store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Cart } from '../types/cart.types';

const initialState: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

const recalculateCart = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + price * item.quantity;
  }, 0);
  
  return { totalItems, totalPrice };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === newItem.productId && item.size === newItem.size
      );
      
      if (existingItemIndex >= 0) {
        // 이미 장바구니에 있는 상품이면 수량만 증가
        state.items[existingItemIndex].quantity += newItem.quantity;
      } else {
        // 새 상품이면 장바구니에 추가
        state.items.push(newItem);
      }
      
      // 장바구니 합계 재계산
      const totals = recalculateCart(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    updateItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; size: string; quantity: number }>
    ) => {
      const { productId, size, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.productId === productId && item.size === size
      );
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // 수량이 0 이하면 삭제
          state.items.splice(itemIndex, 1);
        } else {
          // 수량 업데이트
          state.items[itemIndex].quantity = quantity;
        }
        
        // 장바구니 합계 재계산
        const totals = recalculateCart(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
      }
    },
    
    removeItem: (
      state,
      action: PayloadAction<{ productId: string; size: string }>
    ) => {
      const { productId, size } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
      
      // 장바구니 합계 재계산
      const totals = recalculateCart(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    }
  }
});

export const { addItem, updateItemQuantity, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;