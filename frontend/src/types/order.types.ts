export enum OrderStatus {
  ORDER_COMPLETED = "01",
  ORDER_CANCELLED = "02",
  PAYMENT_FULLFILL = "03",
  SHIPPING_PREPARE = "04",
  SHIPPING = "05",
  SHIPPING_COMPLETED = "06",
  PURCHASE_DECISION = "07"
}

// 백엔드 요청용 주문자 정보 인터페이스
export interface Orderer {
  name: string;
  phoneNumber: string;
  email?: string; // 선택적 필드
}

// 백엔드 요청용 주문 아이템 인터페이스
export interface PurchaseOrderItem {
  itemIdx: number; // @Min(1) 조건을 만족해야 함
  productId: string; // Java에서는 UUID 타입
  productName: string; // @NotBlank 조건을 만족해야 함
  price: number;
  quantity: number; // @Min(1) 조건을 만족해야 함
  amounts: number; // 백엔드에서 기대하는 필드: 총 금액 (price * quantity)
  size?: string; // 선택적 필드 (백엔드에서는 기본값 "FREE" 설정)
}

// 백엔드 요청용 주문 인터페이스
export interface PurchaseOrder {
  orderer: Orderer; // @NotNull, @Valid 조건이 있음
  newlyOrderItem: PurchaseOrderItem[]; // @Size(min = 1), @Valid 조건이 있음
}

// 기존 응답용 주문 아이템 인터페이스
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

// 기존 응답용 주문 인터페이스
export interface Order {
  orderId: string;
  name: string;
  phoneNumber: string;
  email: string;
  paymentId?: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}