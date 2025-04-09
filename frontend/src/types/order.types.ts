export enum OrderStatus {
  ORDER_COMPLETED = "01",
  ORDER_CANCELLED = "02",
  PAYMENT_FULLFILL = "03",
  SHIPPING_PREPARE = "04",
  SHIPPING = "05",
  SHIPPING_COMPLETED = "06",
  PURCHASE_DECISION = "07"
}

export interface OrderItem {
  id: number;
  itemIdx: number;
  productId: string;
  productName: string;
  price: number;
  size: string;
  amount: number;
  quantity: number;
  state: OrderStatus;
}

export interface Order {
  orderId: string;
  name: string;
  phoneNumber: string;
  paymentId?: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}
