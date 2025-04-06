import 'styled-components';

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
      text: string;
      textLight: string;
      textDark: string;
      background: string;
      border: string;
      borderDark: string;
      white: string;
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
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    radii: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      pill: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
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