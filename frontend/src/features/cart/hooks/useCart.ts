// features/cart/hooks/useCart.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../app/store';
import { CartItem } from '../types/cart.types';
import { addItem, updateItemQuantity, removeItem, clearCart } from '../store/cartSlice';
import { Size } from '../../products/types/product.types';

export const useCart = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  
  const addToCart = (item: CartItem) => {
    dispatch(addItem(item));
  };
  
  const updateQuantity = (productId: string, size: Size, quantity: number) => {
    dispatch(updateItemQuantity({ productId, size, quantity }));
  };
  
  const removeFromCart = (productId: string, size: Size) => {
    dispatch(removeItem({ productId, size }));
  };
  
  const emptyCart = () => {
    dispatch(clearCart());
  };
  
  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    emptyCart,
  };
};