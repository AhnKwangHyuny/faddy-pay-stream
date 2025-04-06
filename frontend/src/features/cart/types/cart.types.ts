// 3. 장바구니 관련 타입 정의
// features/cart/types/cart.types.ts
import { Size } from '../../products/types/product.types';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  discountPrice?: number;
  size: Size;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}