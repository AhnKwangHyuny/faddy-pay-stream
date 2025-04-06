import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 요청 인터셉터 타입
export type RequestInterceptor = (
  config: InternalAxiosRequestConfig
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

// 응답 인터셉터 타입
export type ResponseInterceptor = (
  response: AxiosResponse
) => AxiosResponse | Promise<AxiosResponse>;

// 에러 인터셉터 타입
export type ErrorInterceptor = (
  error: AxiosError
) => any;

// axios 인스턴스에 인터셉터를 추가하는 함수
export const addRequestInterceptor = (
  instance: AxiosInstance,
  onFulfilled: RequestInterceptor,
  onRejected?: ErrorInterceptor
) => {
  return instance.interceptors.request.use(onFulfilled, onRejected);
};

export const addResponseInterceptor = (
  instance: AxiosInstance,
  onFulfilled: ResponseInterceptor,
  onRejected?: ErrorInterceptor
) => {
  return instance.interceptors.response.use(onFulfilled, onRejected);
};

// 기본 요청 인터셉터 - 인증 토큰 추가
export const authRequestInterceptor: RequestInterceptor = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // 헤더가 이미 있다고 가정할 수 있음 (InternalAxiosRequestConfig에서는 headers가 항상 존재함)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// 기본 응답 인터셉터 - 데이터 추출
export const responseInterceptor: ResponseInterceptor = (response) => {
  return response.data;
};

// 에러 인터셉터
export const errorInterceptor: ErrorInterceptor = (error) => {
  const errorResponse = error.response;
  
  // 401 에러 처리 (인증 만료 등)
  if (errorResponse && errorResponse.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  return Promise.reject(error);
};
