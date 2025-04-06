import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#3f51b5',
    primaryLight: '#757de8',
    primaryDark: '#002984',
    secondary: '#f50057',
    secondaryLight: '#ff5983',
    secondaryDark: '#bb002f',
    success: '#4caf50',
    danger: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    light: '#f5f5f5',
    dark: '#212121',
    text: '#212121',
    textLight: '#757575',
    textDark: '#000000',
    background: '#ffffff',
    border: '#e0e0e0',
    borderDark: '#bdbdbd',
    white: '#ffffff'
  },
  fonts: {
    base: "'Roboto', sans-serif"
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
    xxxl: '3rem'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  radii: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    pill: '9999px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
  },
  breakpoints: {
    xs: '0',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px'
  },
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    header: 100,
    dropdown: 300,
    sticky: 400,
    modal: 200,
    tooltip: 500,
    toast: 600
  }
};

export default theme; 