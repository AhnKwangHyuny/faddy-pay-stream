// shared/constants/routes.ts

// 애플리케이션 라우트 상수
export const ROUTES = {
  // 메인 페이지
  HOME: '/',
  
  // 상품 관련
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:productId',
  PRODUCT_DETAIL_WITH_ID: (productId: string) => `/products/${productId}`,
  
  // 장바구니
  CART: '/cart',
  
  // 결제 관련
  CHECKOUT: '/checkout',
  PAYMENT_COMPLETE: '/payment/complete',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAIL: '/payment/fail',
  
  // 주문 관련
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:orderId',
  ORDER_DETAIL_WITH_ID: (orderId: string) => `/orders/${orderId}`,
  
  // 정산 관련
  SETTLEMENTS: '/settlements',
  
  // 회원 관련
  LOGIN: '/login',
  SIGNUP: '/signup',
  MY_ACCOUNT: '/my-account',
  
  // 기타
  ABOUT: '/about',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  FAQ: '/faq',
  SHIPPING: '/shipping',
  RETURNS: '/returns',
  
  // 오류 페이지
  NOT_FOUND: '*'
};