import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types/common.types';

// API 기본 URL 설정
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Axios 인스턴스 생성
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초
});

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // API 응답 구조가 { success, data, error } 형태라면 데이터만 추출
    if (response.data && 'success' in response.data) {
      const apiResponse = response.data as ApiResponse<any>;
      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        return Promise.reject(apiResponse.error);
      }
    }
    
    // 기본 응답은 그대로 반환
    return response.data;
  },
  (error: AxiosError) => {
    // 에러 처리
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response.status;
      
      // 401 Unauthorized - 인증 필요
      if (status === 401) {
        // 로그인 페이지로 리다이렉트 또는 토큰 갱신 로직
        console.error('인증이 필요합니다.');
      }
      
      // 403 Forbidden - 권한 없음
      if (status === 403) {
        console.error('접근 권한이 없습니다.');
      }
      
      // 500 Internal Server Error - 서버 오류
      if (status >= 500) {
        console.error('서버 오류가 발생했습니다.');
      }
      
      // 에러 응답 데이터가 있으면 그대로 반환
      if (error.response.data) {
        return Promise.reject(error.response.data);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우 (네트워크 오류)
      console.error('네트워크 오류가 발생했습니다.');
    } else {
      // 요청 설정 중 오류 발생
      console.error('요청 설정 중 오류가 발생했습니다.');
    }
    
    return Promise.reject(error);
  }
);

// 요청 인터셉터
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // JWT 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 기본 API 메서드 (제네릭 타입 지원)
export const apiService = {
  // GET 요청
  get: async <T>(url: string, config?: any): Promise<T> => {
    return api.get<T, T>(url, config);
  },
  
  // POST 요청
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    return api.post<T, T>(url, data, config);
  },
  
  // PUT 요청
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    return api.put<T, T>(url, data, config);
  },
  
  // PATCH 요청
  patch: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    return api.patch<T, T>(url, data, config);
  },
  
  // DELETE 요청
  delete: async <T>(url: string, config?: any): Promise<T> => {
    return api.delete<T, T>(url, config);
  },
};
