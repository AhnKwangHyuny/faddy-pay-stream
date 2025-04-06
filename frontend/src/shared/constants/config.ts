// shared/constants/config.ts

// 환경 변수
const ENV = process.env.NODE_ENV || 'development';

// API URL 설정
const API_URL = {
  development: process.env.REACT_APP_DEV_API_URL || 'http://localhost:8080/api',
  test: process.env.REACT_APP_TEST_API_URL || 'http://test-api.faddy.co.kr/api',
  production: process.env.REACT_APP_PROD_API_URL || 'https://api.faddy.co.kr/api'
};

// 토스 페이먼츠 API 키
const TOSS_PAYMENTS_API_KEY = {
  development: process.env.REACT_APP_DEV_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
  test: process.env.REACT_APP_TEST_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
  production: process.env.REACT_APP_PROD_TOSS_CLIENT_KEY || ''
};

// 앱 설정
export const CONFIG = {
  ENV,
  API_URL: API_URL[ENV as keyof typeof API_URL],
  TOSS_PAYMENTS_CLIENT_KEY: TOSS_PAYMENTS_API_KEY[ENV as keyof typeof TOSS_PAYMENTS_API_KEY],
  
  // 페이징 관련
  DEFAULT_PAGE_SIZE: 12,
  
  // 인증 관련
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY_KEY: 'token_expiry',
  
  // 저장소 키
  STORAGE_KEYS: {
    CART: 'faddy_cart',
    SAVED_ADDRESSES: 'faddy_saved_addresses',
    USER_PREFERENCES: 'faddy_user_preferences'
  },
  
  // 배송 관련
  FREE_SHIPPING_THRESHOLD: 100000, // 10만원 이상 무료배송
  DEFAULT_SHIPPING_COST: 3000,     // 기본 배송비 3천원
};