// 5. 주문 관련 타입 정의
// features/orders/types/order.types.ts
import { OrderStatus } from '../../../shared/types/common.types';
import { Size } from '../../products/types/product.types';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  size: Size;
  quantity: number;
  amount: number;
  status: OrderStatus;
}

export interface Order {
  orderId: string;
  name: string;
  phoneNumber: string;
  orderState: OrderStatus;
  paymentId: string | null;
  totalPrice: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}