import axios from 'axios';
import { CONFIG } from '../../../shared/constants/config';

interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// 로그인 서비스
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${CONFIG.API_URL}/auth/login`, {
      email,
      password,
    });
    
    const { token, refreshToken, expiresIn } = response.data;
    
    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    
    // 토큰 만료 시간 설정 (현재 시간 + expiresIn)
    const expiryTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem(CONFIG.TOKEN_EXPIRY_KEY, expiryTime.toString());
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// 로그아웃 서비스
export const logout = (): void => {
  localStorage.removeItem(CONFIG.TOKEN_KEY);
  localStorage.removeItem(CONFIG.REFRESH_TOKEN_KEY);
  localStorage.removeItem(CONFIG.TOKEN_EXPIRY_KEY);
  
  // 페이지 리로드 또는 리다이렉트 로직 추가 가능
};

// 현재 인증 상태 확인
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(CONFIG.TOKEN_KEY);
  const expiryTime = localStorage.getItem(CONFIG.TOKEN_EXPIRY_KEY);
  
  if (!token || !expiryTime) {
    return false;
  }
  
  // 토큰 만료 시간 확인
  const expiryTimestamp = parseInt(expiryTime, 10);
  const currentTimestamp = new Date().getTime();
  
  return expiryTimestamp > currentTimestamp;
};

// 소셜 로그인 서비스
export const socialLogin = async (provider: string): Promise<void> => {
  // 소셜 로그인 구현
  // 일반적으로 OAuth 리다이렉트 URL을 열거나 팝업 창을 띄웁니다.
  window.location.href = `${CONFIG.API_URL}/auth/${provider}`;
};

// 소셜 로그인 콜백 처리
export const handleSocialLoginCallback = async (provider: string, code: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${CONFIG.API_URL}/auth/${provider}/callback`, { code });
    
    const { token, refreshToken, expiresIn } = response.data;
    
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    
    const expiryTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem(CONFIG.TOKEN_EXPIRY_KEY, expiryTime.toString());
    
    return response.data;
  } catch (error) {
    console.error(`${provider} login callback error:`, error);
    throw error;
  }
}; 