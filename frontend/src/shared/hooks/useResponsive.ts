// 13. 반응형 훅
// shared/hooks/useResponsive.ts
import { useEffect, useState } from 'react';
import { lightTheme } from '../../assets/styles/theme';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoints = {
    xs: parseInt(lightTheme.breakpoints.xs),
    sm: parseInt(lightTheme.breakpoints.sm),
    md: parseInt(lightTheme.breakpoints.md),
    lg: parseInt(lightTheme.breakpoints.lg),
    xl: parseInt(lightTheme.breakpoints.xl),
    xxl: parseInt(lightTheme.breakpoints.xxl),
  };

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < breakpoints.md,
    isTablet: windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
    isDesktop: windowSize.width >= breakpoints.lg,
    breakpoint: getBreakpoint(windowSize.width, breakpoints),
    lessThan: (breakpoint: Breakpoint) => windowSize.width < breakpoints[breakpoint],
    greaterThan: (breakpoint: Breakpoint) => windowSize.width >= breakpoints[breakpoint],
    between: (min: Breakpoint, max: Breakpoint) => 
      windowSize.width >= breakpoints[min] && windowSize.width < breakpoints[max],
  };
};

const getBreakpoint = (
  width: number,
  breakpoints: Record<Breakpoint, number>
): Breakpoint => {
  if (width < breakpoints.sm) return 'xs';
  if (width < breakpoints.md) return 'sm';
  if (width < breakpoints.lg) return 'md';
  if (width < breakpoints.xl) return 'lg';
  if (width < breakpoints.xxl) return 'xl';
  return 'xxl';
};