import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '../types/product.types';

interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; size: string } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const calculateCartTotals = (items: CartItem[]): { totalPrice: number; totalItems: number } => {
  return items.reduce(
    (acc, item) => {
      return {
        totalPrice: acc.totalPrice + item.product.price * item.quantity,
        totalItems: acc.totalItems + item.quantity,
      };
    },
    { totalPrice: 0, totalItems: 0 }
  );
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, size } = action.payload;
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.size === size
      );
      
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        updatedItems = [...state.items, { product, quantity, size }];
      }
      
      const { totalPrice, totalItems } = calculateCartTotals(updatedItems);
      
      return {
        items: updatedItems,
        totalPrice,
        totalItems
      };
    }
    
    case 'REMOVE_ITEM': {
      const { productId, size } = action.payload;
      const updatedItems = state.items.filter(
        item => !(item.product.id === productId && item.size === size)
      );
      
      const { totalPrice, totalItems } = calculateCartTotals(updatedItems);
      
      return {
        items: updatedItems,
        totalPrice,
        totalItems
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, size, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { 
          type: 'REMOVE_ITEM', 
          payload: { productId, size } 
        });
      }
      
      const updatedItems = state.items.map(item => {
        if (item.product.id === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });
      
      const { totalPrice, totalItems } = calculateCartTotals(updatedItems);
      
      return {
        items: updatedItems,
        totalPrice,
        totalItems
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalPrice: 0,
        totalItems: 0
      };
      
    default:
      return state;
  }
};

// Default initial state
const initialCartState: CartState = {
  items: [],
  totalPrice: 0,
  totalItems: 0
};

// Create context
const CartContext = createContext<{
  cart: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  cart: initialCartState,
  dispatch: () => undefined,
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load cart from localStorage if available
  const [persistedCartState] = React.useState(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : initialCartState;
    } catch (error) {
      console.error('Failed to restore cart from localStorage:', error);
      return initialCartState;
    }
  });
  
  const [cart, dispatch] = useReducer(cartReducer, persistedCartState);
  
  // Save cart to localStorage on any state change
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);
  
  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;