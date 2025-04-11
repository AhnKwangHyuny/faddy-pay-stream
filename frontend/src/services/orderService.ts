import { Order, PurchaseOrder, OrderItem, OrderStatus } from '../types/order.types';
import { apiService } from './api';
import { v4 as uuidv4 } from 'uuid';
import { ensureUuid } from '../utils/helpers';

// 주문 생성
export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  try {
    console.log('원본 주문 데이터:', order);

    // PurchaseOrder 형식에 맞게 데이터 변환
    const purchaseOrderData = {
      orderer: {
        name: order.name || '',
        phoneNumber: order.phoneNumber || ''
        // email 필드 제거 - 백엔드 Orderer 클래스에 없음
      },
      newlyOrderItem: order.items?.map((item, index) => {
        // 문자열 ID를 유효한 UUID로 변환 (UUID 타입 변환 확인)
        const productUuid = ensureUuid(item.productId);
        console.log(`상품 ID 변환: ${item.productId} -> ${productUuid}`);

        return {
          itemIdx: index + 1, // 1부터 시작하도록 (백엔드 @Min(1) 제약조건 충족)
          productId: productUuid,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity, // 수량
          size: item.size || 'FREE',
          amounts: item.price * item.quantity // amounts는 총 금액 (가격 * 수량)
        };
      }) || []
    };

    console.log('변환된 주문 데이터:', purchaseOrderData);

    // 요청 데이터 상세 로깅
    console.log('요청 URL:', '/api/orders/new');
    console.log('요청 데이터 (JSON):', JSON.stringify(purchaseOrderData, null, 2));

    try {
      // API 호출 - axios 인스턴스를 통해 절대 경로 사용
      const response = await apiService.post<any>('/api/orders/new', purchaseOrderData);
      console.log('응답 데이터:', response);

      // 백엔드 응답 구조를 프론트엔드 Order 타입으로 변환
      if (response && response.success && response.data) {
        const frontendOrder = convertBackendOrderToFrontend(response.data);
        console.log('변환된 프론트엔드 Order 객체:', frontendOrder);
        return frontendOrder;
      }

      return response.data || response;
    } catch (error) {
      console.error('API 요청 에러:', error);
      // 오류 발생 시 대체 URL로 시도
      try {
        console.log('대체 URL로 시도: /orders/new');
        const alternativeResponse = await apiService.post<any>('/orders/new', purchaseOrderData);
        console.log('대체 URL 응답:', alternativeResponse);

        if (alternativeResponse && alternativeResponse.success && alternativeResponse.data) {
          return convertBackendOrderToFrontend(alternativeResponse.data);
        }

        return alternativeResponse.data || alternativeResponse;
      } catch (altError) {
        console.error('대체 URL 요청 에러:', altError);
        throw error; // 원래 에러를 다시 던짐
      }
    }
  } catch (error) {
    console.error('주문 생성 실패:', error);
    throw error;
  }
};

// 백엔드 주문 아이템 인터페이스 (백엔드 응답 구조에 맞춤)
interface BackendOrderItem {
  id?: number;
  orderId?: string;
  itemIdx: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  amount: number;
  size?: string;
  itemStatus?: string;
}

// 백엔드 주문 인터페이스 (백엔드 응답 구조에 맞춤)
interface BackendOrder {
  orderId: string;
  paymentId?: string;
  totalPrice: number;
  status: string;
  items: BackendOrderItem[];
  orderer?: {
    name?: string;
    phoneNumber?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// 문자열을 OrderStatus 열거형으로 변환하는 유틸리티 함수
const convertToOrderStatus = (status: string): OrderStatus => {
  // OrderStatus에 해당하는 값이 있는지 확인
  const matchedStatus = Object.entries(OrderStatus).find(
      ([key, value]) => value === status
  );

  if (matchedStatus) {
    return matchedStatus[1] as OrderStatus;
  }

  // 기본값으로 ORDER_COMPLETED 반환
  console.warn(`알 수 없는 주문 상태: ${status}, ORDER_COMPLETED로 기본 설정됨`);
  return OrderStatus.ORDER_COMPLETED;
};

// 백엔드 응답을 프론트엔드 Order 타입으로 변환하는 유틸리티 함수
const convertBackendOrderToFrontend = (backendOrder: BackendOrder): Order => {
  // 백엔드 status를 OrderStatus 열거형으로 변환
  const orderStatus = convertToOrderStatus(backendOrder.status);

  return {
    orderId: backendOrder.orderId,
    // 중첩된 orderer 객체에서 필드 추출
    name: backendOrder.orderer?.name || '',
    phoneNumber: backendOrder.orderer?.phoneNumber || '',
    email: backendOrder.orderer?.email || 'customer@example.com', // 이메일이 null인 경우 기본값 설정
    paymentId: backendOrder.paymentId,
    totalPrice: backendOrder.totalPrice,
    status: orderStatus,
    // items 배열 변환 (itemStatus → state)
    items: (backendOrder.items || []).map((item: BackendOrderItem) => {
      // 아이템 상태 변환
      const itemStatus = item.itemStatus
          ? convertToOrderStatus(item.itemStatus)
          : orderStatus;

      return {
        id: item.id || 0,
        itemIdx: item.itemIdx,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        amount: item.amount,
        size: item.size || 'FREE',
        state: itemStatus
      };
    }),
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.updatedAt
  };
};

// 주문 조회
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    console.log(`주문 조회: ${orderId}`);
    const response = await apiService.get<any>(`/api/orders/${orderId}`);

    // 응답이 ApiResponse 형식인지 확인
    if (response && typeof response === 'object') {
      if ('success' in response && response.success === true && response.data) {
        // 백엔드 응답 구조를 프론트엔드 Order 타입으로 변환
        return convertBackendOrderToFrontend(response.data);
      }
      // success는 true지만 data가 없는 경우
      if ('success' in response && response.success === true) {
        return response;
      }
      // success가 false인 경우
      if ('success' in response && !response.success) {
        throw new Error(response.message || '주문 조회에 실패했습니다');
      }
      // 다른 응답 형태
      return response;
    }

    return response;
  } catch (error) {
    console.error(`주문 조회 실패: ${orderId}`, error);
    throw error;
  }
};

// 주문 내역 조회
export const getOrderHistory = async (): Promise<Order[]> => {
  try {
    return await apiService.get<Order[]>('/api/orders/history');
  } catch (error) {
    console.error('주문 내역 조회 실패:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
};

// 주문 취소
export const cancelOrder = async (orderId: string): Promise<Order> => {
  try {
    return await apiService.post<Order>(`/api/orders/${orderId}/cancel`);
  } catch (error) {
    console.error(`주문 취소 실패: ${orderId}`, error);
    throw error;
  }
};

// 주문 품목 취소
export const cancelOrderItems = async (
    orderId: string,
    itemIdxs: number[]
): Promise<Order> => {
  try {
    return await apiService.post<Order>(`/api/orders/${orderId}/cancel-items`, { itemIdxs });
  } catch (error) {
    console.error(`주문 품목 취소 실패: ${orderId}`, error);
    throw error;
  }
};