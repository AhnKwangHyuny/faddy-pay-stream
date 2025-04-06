// 13. 반응형 훅
// shared/hooks/useResponsive.ts
import { useState, useEffect } from 'react';
import { DefaultTheme, useTheme } from 'styled-components';

interface UseResponsiveResult {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

export const useResponsive = (): UseResponsiveResult => {
  const theme = useTheme() as DefaultTheme;
  
  const getBreakpointValue = (breakpoint: string) => {
    return parseInt(breakpoint.replace('px', ''), 10);
  };
  
  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const isMobile = windowSize < getBreakpointValue(theme.breakpoints.md);
  const isTablet = windowSize >= getBreakpointValue(theme.breakpoints.md) && windowSize < getBreakpointValue(theme.breakpoints.lg);
  const isDesktop = windowSize >= getBreakpointValue(theme.breakpoints.lg) && windowSize < getBreakpointValue(theme.breakpoints.xl);
  const isLargeDesktop = windowSize >= getBreakpointValue(theme.breakpoints.xl);
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
};