// shared/constants/apiEndpoints.ts

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 상품 관련
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  
  // 장바구니 관련
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  REMOVE_FROM_CART: '/cart/remove',
  UPDATE_CART: '/cart/update',
  CLEAR_CART: '/cart/clear',
  
  // 결제 관련
  CREATE_ORDER: '/orders',
  CREATE_PAYMENT_REQUEST: '/payments/request',
  VERIFY_PAYMENT: '/payments/verify',
  
  // 주문 관련
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  CANCEL_ORDER: (id: string) => `/orders/${id}/cancel`,
  REQUEST_REFUND: (id: string) => `/orders/${id}/refund`,
  
  // 정산 관련
  SETTLEMENTS: '/settlements',
  
  // 회원 관련
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  USER_PROFILE: '/user/profile',
  
  // 배송지 관련
  ADDRESSES: '/addresses',
};