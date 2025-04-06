// 7. 에러 핸들러
// services/api/errorHandler.ts
import { AxiosError } from 'axios';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    if (axiosError.response) {
      const status = axiosError.response.status;
      const apiError = axiosError.response.data;
      
      // 사용자에게 에러 메시지 표시
      if (status !== 401) { // 401은 인터셉터에서 처리
        toast.error(apiError.message || '요청 처리 중 오류가 발생했습니다.');
      }
      
      return {
        status: status,
        message: apiError.message || '알 수 없는 오류가 발생했습니다.',
        code: apiError.code,
        details: apiError.details
      };
    }
    
    if (axiosError.request) {
      // 요청은 만들어졌으나 응답이 없는 경우
      toast.error('서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.');
      return {
        status: 0,
        message: '서버 연결에 실패했습니다.'
      };
    }
  }
  
  // 그 외 오류
  toast.error('알 수 없는 오류가 발생했습니다.');
  return {
    status: 500,
    message: '알 수 없는 오류가 발생했습니다.'
  };
};