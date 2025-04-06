// 12. 글로벌 스타일
// assets/styles/globalStyles.ts
import { createGlobalStyle } from 'styled-components';
import { lightTheme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    font-family: ${lightTheme.fonts.base};
    font-size: 16px;
    color: ${lightTheme.colors.text};
    background-color: ${lightTheme.colors.background};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }
  
  h1 {
    font-size: ${lightTheme.fontSizes.xxxl};
  }
  
  h2 {
    font-size: ${lightTheme.fontSizes.xxl};
  }
  
  h3 {
    font-size: ${lightTheme.fontSizes.xl};
  }
  
  h4 {
    font-size: ${lightTheme.fontSizes.lg};
  }
  
  h5 {
    font-size: ${lightTheme.fontSizes.md};
  }
  
  h6 {
    font-size: ${lightTheme.fontSizes.sm};
  }
  
  a {
    color: ${lightTheme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    
    &:disabled {
      cursor: not-allowed;
    }
  }
  
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }
  
  @media (max-width: ${lightTheme.breakpoints.md}) {
    html {
      font-size: 14px;
    }
  }
`;