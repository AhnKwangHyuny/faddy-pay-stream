import { useState, useEffect, useCallback } from 'react';
import { isAuthenticated, logout } from '../../features/auth/services/authService';

interface UseAuthResult {
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuth = (): UseAuthResult => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  const checkAuth = useCallback(() => {
    const authStatus = isAuthenticated();
    setIsLoggedIn(authStatus);
    return authStatus;
  }, []);
  
  const handleLogout = useCallback(() => {
    logout();
    setIsLoggedIn(false);
  }, []);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return {
    isAuthenticated: isLoggedIn,
    logout: handleLogout,
    checkAuth,
  };
}; 