import 'styled-components';

// theme.ts에서 정의한 타입 구조를 DefaultTheme에 확장
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      secondary: string;
      secondaryLight: string;
      secondaryDark: string;
      success: string;
      danger: string;
      warning: string;
      info: string;
      light: string;
      dark: string;
      white: string;
      background: string;
      text: string;
      textLight: string;
      textDark: string;
      border: string;
      borderDark: string;
    };
    fonts: {
      base: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    radii: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      pill: string;
    };
    zIndices: {
      hide: number;
      auto: string;
      base: number;
      header: number;
      dropdown: number;
      sticky: number;
      modal: number;
      tooltip: number;
      toast: number;
    };
  }
} 